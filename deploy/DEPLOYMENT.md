# Deploying without Docker (single Ubuntu/Debian VPS)

This is a plain, native deployment: PostgreSQL installed directly on the
box, the backend run as a systemd service, and the three frontends served
as static files by nginx. No containers anywhere.

Layout assumed below:
- `api.yourdomain.com` -> backend
- `yourdomain.com` -> customer storefront (`user/`)
- `admin.yourdomain.com` -> branch admin panel
- `superadmin.yourdomain.com` -> superadmin panel

Replace every `yourdomain.com` with your real domain before you start -
DNS records for all four (sub)domains need to point at this server's IP
before certbot will work.

## 0. Packages

```bash
sudo apt-get update
sudo apt-get install -y openjdk-21-jre-headless nginx certbot python3-certbot-nginx
```

(Node.js is only needed wherever you *build* the frontends - that can be
this server or your own machine. You need Maven + a JDK wherever you build
the backend jar - again, this server or your own machine, doesn't have to
be the same place it runs.)

## 1. Database - native PostgreSQL, no Docker

```bash
cd deploy
sudo bash setup-postgres.sh <pick-a-real-password>
```

This installs Postgres, creates a `salon` database and a `salon` user with
the password you gave it, and prints the exact `DB_URL`/`DB_USERNAME`/
`DB_PASSWORD` values to put in the backend's `.env` next.

## 2. Backend

```bash
cd spring-backend
mvn clean package -DskipTests          # produces target/salon-backend.jar

sudo mkdir -p /opt/salon-backend
sudo cp target/salon-backend.jar /opt/salon-backend/
sudo cp .env.example /opt/salon-backend/.env
sudo useradd -r -s /bin/false salon 2>/dev/null || true
sudo chown -R salon:salon /opt/salon-backend
```

Edit `/opt/salon-backend/.env`:
```bash
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:postgresql://localhost:5432/salon
DB_USERNAME=salon
DB_PASSWORD=<the password you set in step 1>

JWT_SECRET=<generate with: openssl rand -hex 48>
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com,https://superadmin.yourdomain.com

SEED_ENABLED=true
SEED_SUPERADMIN_EMAIL=you@yourdomain.com
SEED_SUPERADMIN_PASSWORD=<pick a real password, not the default>

# Optional: powers the AI chat widget on the customer storefront. Leave
# ANTHROPIC_API_KEY blank to skip it - the widget degrades gracefully
# instead of breaking anything else.
ANTHROPIC_API_KEY=<your key from console.anthropic.com>
ANTHROPIC_MODEL=claude-sonnet-5
ANTHROPIC_MAX_TOKENS=1024

# Uploaded product/service/template images. Point this somewhere persistent
# and backed up (NOT the jar's own directory if you ever wipe/redeploy that)
# and make sure the "salon" service user can write to it:
#   sudo mkdir -p /opt/salon-backend/uploads
#   sudo chown -R salon:salon /opt/salon-backend/uploads
UPLOADS_DIR=/opt/salon-backend/uploads
UPLOADS_PUBLIC_BASE_URL=https://api.yourdomain.com/uploads
```

Install and start the systemd service:
```bash
sudo cp deploy/salon-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now salon-backend
sudo systemctl status salon-backend     # should show "active (running)"
```

After confirming it boots (see step 4), set `SEED_ENABLED=false` in
`.env` and `sudo systemctl restart salon-backend` - the bootstrap only
needs to run once.

## 3. Frontends

Build each one **with its production API URL set first**:

```bash
# admin/ and superadmin/ already have .env.production checked in - just
# edit the domain in each before building:
#   admin/.env.production            -> VITE_API_URL
#   superadmin/.env.production       -> VITE_API_URL

cd frontend/admin        && npm install && npm run build
cd ../superadmin         && npm install && npm run build
cd ../user               && npm install && npm run build
```

Each produces a `dist/` folder. Copy them into place:
```bash
sudo mkdir -p /var/www/salon/{user,admin,superadmin}
sudo cp -r frontend/user/dist/*        /var/www/salon/user/
sudo cp -r frontend/admin/dist/*       /var/www/salon/admin/
sudo cp -r frontend/superadmin/dist/*  /var/www/salon/superadmin/
```

Install the nginx configs:
```bash
sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/
for f in api user admin superadmin; do
  sudo ln -sf /etc/nginx/sites-available/$f.conf /etc/nginx/sites-enabled/
done
sudo nginx -t && sudo systemctl reload nginx
```

Get SSL certificates (do this after DNS is pointed at the server and nginx
is reloaded with the configs above - certbot edits them in place to add
the HTTPS server blocks):
```bash
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
sudo certbot --nginx -d superadmin.yourdomain.com
```

## 4. Verify

```bash
curl https://api.yourdomain.com/api/health
# {"status":"ok","time":"..."}
```

Then open `https://superadmin.yourdomain.com` and log in with the
superadmin credentials from step 2's `.env`.

## Updating later

**Backend:**
```bash
cd spring-backend && git pull && mvn clean package -DskipTests
sudo cp target/salon-backend.jar /opt/salon-backend/
sudo systemctl restart salon-backend
```

**Any frontend:**
```bash
cd frontend/<app> && git pull && npm install && npm run build
sudo rm -rf /var/www/salon/<app>/*
sudo cp -r dist/* /var/www/salon/<app>/
```

## Logs

```bash
sudo journalctl -u salon-backend -f      # backend logs
sudo tail -f /var/log/nginx/error.log    # nginx errors
```

## What's real vs. not yet, on this deployment

Same status as everywhere else in this project:
- **superadmin**: Services/Offers/Products talk to the real database, incl.
  the approval workflow. Bookings/Branches/Barbers/Customers/Holidays/
  Templates/Dashboard/Reports haven't been individually audited for the
  same casing mismatches found in the first three.
- **admin**: only auth is wired to the real backend; every data store
  (bookings, barbers, etc.) is still browser-local, not from Postgres.
- **user**: entirely local mock data, no backend calls at all yet.

Deploying this now gives you a real, working login + catalog-approval
flow end to end. The gaps above are unchanged by moving from
Docker to native deployment - they're application-level, not infra-level.
