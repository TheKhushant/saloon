# Salon Platform - Deployment Package

**Start here: `deploy/DEPLOYMENT.md`** - a step-by-step native deployment
guide (PostgreSQL installed directly on the box, backend run via systemd,
frontends served by nginx). No Docker anywhere.

## What's in this package

```
backend/       Spring Boot API (Java 21, PostgreSQL, JWT auth)
admin/         Branch-level admin panel (React/Vite)
superadmin/    Multi-branch superadmin panel (React/Vite)
user/          Customer-facing storefront (React/Vite)
deploy/        Everything needed to deploy without Docker:
  DEPLOYMENT.md        <- the actual step-by-step guide
  setup-postgres.sh    <- native PostgreSQL install + db/user creation
  salon-backend.service <- systemd unit for running the backend as a service
  nginx/               <- one config per (sub)domain, SPA-routing-aware
```

## First step, always

```bash
cd backend
mvn clean install
```

This backend was built in a sandbox where Maven Central was network-blocked,
so it's never actually been compiled end to end. Do this before anything
else - if it fails, the error message is the most useful thing you can send
back for a fast fix.

## Honest status of each app

- **backend**: complete feature set (auth, approval workflow, slot-capacity
  booking limits, SQL-side dashboard aggregation) but unverified compile -
  see above.
- **superadmin**: real auth + Services/Offers/Products fully wired to the
  database, including approve/reject. Verified with an actual `npm run
  build` in the sandbox that built this. Other resources
  (bookings/branches/barbers/customers/holidays/templates/dashboard/reports)
  haven't been individually checked for the same casing mismatches found
  and fixed in the first three.
- **admin**: real auth wired to the database; every data store (bookings,
  barbers, etc.) is still browser-local only.
- **user**: fully local mock data, no backend calls yet.

None of that changes based on Docker vs. native deployment - it's
application-level progress, not infrastructure.
