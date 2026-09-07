# Salon Backend (Spring Boot / Java)

A from-scratch Spring Boot rewrite of the Node/Express backend, serving the
same three frontends (`admin/`, `superadmin/`, `user/`) with the same REST
contract (same paths, same JSON shapes) so the frontends don't need changes
beyond the API base URL.

## ⚠️ Read this first: unverified build

**I could not compile this in the sandbox I built it in.** Maven Central
(`repo.maven.apache.org`) is blocked by that environment's network egress
rules, so `mvn compile` fails at dependency resolution before touching a
single source file. I hand-wrote and cross-checked ~100 files (entities,
repositories, services, controllers, DTOs) for structural correctness —
brace/paren balance, matching method signatures between controllers and
services, correct imports — and I'm confident in the design, but **you
should run `mvn clean compile` (or `mvn clean install`) as the very first
step** once you have this on a machine with real internet access. Given the
size of this codebase, it would not be surprising if there are 1-2 small
compile errors (a missing import, a typo) even after careful review. If you
hit any, paste the error back to me and I'll fix it immediately — that's a
much faster loop than me guessing blind.

This is a meaningfully different situation from the Node backend earlier in
this conversation, which I *did* install, boot, and hit with curl in the
sandbox. I want to be upfront about that difference in confidence level.

## Stack

- **Java 21 + Spring Boot 3.3**
- **PostgreSQL + Spring Data JPA / Hibernate** (you asked to proceed without
  picking Mongo vs. Postgres, so I defaulted to Postgres — it's the more
  idiomatic Spring Boot pairing and gives real foreign keys/transactions
  instead of the embedded-document schema the Mongo version used)
- **Flyway** for schema migrations (`src/main/resources/db/migration/V1__init.sql`)
  — the schema is fully described in one SQL file, not inferred from
  annotations, so what's in the DB is exactly what's in source control
- **Spring Security + JJWT** for stateless JWT auth (no session state, no
  per-request DB lookup for auth — the token itself carries id/role/branchId)
- **Bean Validation** (`jakarta.validation`) on request DTOs
- **Lombok** to cut entity/DTO boilerplate
- **Spring Boot Actuator** for `/actuator/health` (liveness/readiness probes)

## Setup

```bash
mvn clean install                 # THIS IS THE FIRST THING TO RUN - see warning above
cp .env.example .env
# edit .env: at minimum set a real JWT_SECRET (32+ bytes)

docker compose up --build         # runs Postgres + the API together
# OR, against a Postgres you already have running:
export $(cat .env | xargs) && mvn spring-boot:run
```

On first boot with `SPRING_PROFILES_ACTIVE=dev` (the default),
`SuperadminBootstrap` creates exactly **one** thing: the initial superadmin
login (from `SEED_SUPERADMIN_EMAIL`/`SEED_SUPERADMIN_PASSWORD`). No sample
branches, barbers, services, products, or offers are created - the database
starts genuinely empty and everything else is real data you create through
the app.
- Superadmin: `superadmin@salon.com` / `Password@123` (change immediately after first login)

## No seed/dummy data

The only automatic seeding is the superadmin bootstrap described above,
controlled by `app.seed.enabled` (true in `dev`, false in `prod` - see
`application-prod.yml`). It's safe to leave on: it only acts when there are
zero admin accounts at all, so it never runs again once a real superadmin
exists. In production, create the first superadmin manually instead (a
direct SQL insert with a bcrypt hash, or temporarily flip `SEED_ENABLED=true`
for one boot then back off).

## Approval workflow: superadmin creates -> admin approves -> customer sees it

`SalonService`, `Product`, and `Offer` each carry an `approvalStatus`
(`PENDING` / `APPROVED` / `REJECTED`), independent of the existing `active`
flag:

- **Any new item starts `PENDING`**, regardless of who creates it (admin or
  superadmin).
- **The admin dashboard shows everything** - `GET /api/admin/services`,
  `/api/admin/products`, `/api/admin/offers` are not filtered by approval
  status, so a branch admin can see what's waiting for review (optionally
  filter with `?approvalStatus=PENDING`).
- **A branch admin (or superadmin) approves or rejects** via
  `PATCH /api/admin/{services|products|offers}/{id}/approve` or `/reject`.
- **Only `APPROVED` (and `active=true`) items reach customers** -
  `/api/public/services`, `/api/public/services/{id}`, `/api/public/products`,
  `/api/public/offers`, and `/api/public/offers/validate` all filter on
  both conditions. `BookingService` enforces the same gate when pricing a
  *public* booking (an unapproved service can't be booked by a customer even
  by guessing its ID) - but **not** for admin-created walk-in bookings,
  since an admin can already see and manage pending items directly in their
  own dashboard; the gate protects what anonymous customers can reach, not
  what staff can do.
- Editing an approved item does **not** reset it back to `PENDING` - a
  deliberate simplification to avoid repeatedly hiding live items on every
  small edit. If you want "any edit needs re-approval," that's a small
  follow-up change to the three controllers' `update()` methods.

This is scoped to Services/Products/Offers - the catalog items that reach
the `user/` storefront. Branches and Barbers also appear on
`/api/public/**` but were left out of the approval workflow (a branch admin
managing their own branch's barbers doesn't obviously need their own
barbers gated by approval). Say the word if you want that extended too.

## Architecture

```
entity/       21 JPA entities - the relational equivalent of the Mongoose schemas
repository/   Spring Data JPA interfaces (mostly derived queries + a few @Query/Specification)
security/     JwtService (issue/parse), JwtAuthenticationFilter, AuthPrincipal, AuthContext, BranchScope
service/      Business logic: AuthService, BookingService (pricing + double-booking guard),
              ProductService, TemplateService, DashboardService, ReportService, SettingsService,
              AvailabilityService
controller/   REST endpoints, thin - delegate to services or repositories directly for simple CRUD
dto/          Request/response records (never expose entities with password fields directly)
exception/    ApiException hierarchy + @RestControllerAdvice -> {"message": "..."} JSON, matching
              the Node API's error shape
config/       SecurityConfig, JpaConfig (auditing), SuperadminBootstrap, JSON auth entry point/access denied handler
ratelimit/    In-memory per-IP rate limiter (see caveat below)
```

## Route map

Identical paths to the Node backend:
- `/api/auth/**` — admin login/register/me/forgot-reset-password, customer signup/login/me/forgot-reset-password
- `/api/admin/**` — branches, barbers, services, products (+allocations), stock-requests, offers,
  customers, holidays, templates (+duplicate/favorite/assignments), bookings (+upcoming), settings,
  stats/overview, stats/popular-services, reports/summary — all require an admin/superadmin JWT
- `/api/admin/uploads/{products|services|templates}` — multipart image upload (JPEG/PNG/WEBP/GIF,
  max 5MB), stores to disk under `UPLOADS_DIR`, returns `{url}`. Served back out at `/uploads/**`
  (publicly readable, no auth needed to view an image).
- `/api/admin/bookings/{bookingId}/payments` (GET) and `/api/admin/payments/{id}` (PATCH) — view/
  update a booking's deposit or payment record. There's no payment gateway wired up (Razorpay/Stripe
  would sit here) - this just lets an admin record that a deposit was collected by some other means
  and mark it PAID.
- `/api/public/**` — branches, services, products, barbers, offers(+validate), settings, availability,
  bookings (guest or customer) — `/api/public/bookings/mine` requires a customer JWT
- `/api/public/services/{id}/earliest-availability?daysAhead=14` — finds the soonest open slot for a
  service at each branch that offers it, sorted earliest-first. Uses the exact same per-slot capacity
  check as real booking creation, so a slot returned here is guaranteed bookable.
- `/api/public/chat/stream` — SSE-streamed AI chat, grounded in live approved services/branches/offers.
  Degrades gracefully (clear error, not a crash) if `ANTHROPIC_API_KEY` is unset.

### Deposits

`Settings.requireDepositForBooking` + `Settings.depositPercentage` (default 20%) control whether a
new booking requires a deposit. When on, `BookingService` snapshots `depositRequired`/`depositAmount`
onto the `Booking` at creation time (so changing the setting later doesn't retroactively change what
an existing booking already required), and creates a `Payment` row (`type=DEPOSIT`, `status=PENDING`)
for an admin to mark paid once actually collected.

## What carried over from the Node version's production hardening

- **Server-side pricing** — `BookingService.computeTotal()` recomputes the
  price from the `SalonService` entity and validates any offer code; a
  client-submitted total is never trusted (public create) or is
  admin-override-only (admin create, since admins are trusted).
- **Double-booking prevention** — enforced at *two* layers this time: an
  application check (`assertSlotFree`) AND a partial unique index in the
  Postgres schema itself (`idx_bookings_no_double_book`), so even a bug in
  the application logic can't create a duplicate booking.
- **Per-slot capacity limit** — a branch's time slot (branch + date + time,
  regardless of which barber) can hold at most `Settings.maxBookingsPerSlot`
  concurrent bookings (default **5**, configurable via `PUT
  /api/admin/settings`, superadmin only). This is enforced safely under
  concurrency using a Postgres transaction-scoped advisory lock
  (`BookingRepository.lockSlot`) taken before counting existing bookings for
  that exact slot, so two simultaneous requests for the last open spot can't
  both read "4 of 5 booked" and both succeed - the second one blocks until
  the first transaction finishes, then sees the updated count. This composes
  with (not replaces) the per-barber double-booking check above: a specific
  barber still can't be double-booked even if the branch hasn't hit overall
  capacity. `GET /api/public/availability` also returns
  `remainingCapacityByTime` so the storefront can grey out full slots
  without an extra request per time.
- **Fail-fast config** — `JwtService.init()` refuses to start if
  `JWT_SECRET` is missing or under 32 bytes.
- **Liveness/readiness** — Spring Boot Actuator's `/actuator/health/liveness`
  and `/actuator/health/readiness` probes are enabled
  (`management.health.livenessstate/readinessstate.enabled=true`).
- **Structured logging** via Logback, quieter in the `prod` profile.
- **Graceful shutdown** — `server.shutdown: graceful` lets in-flight
  requests finish before the JVM exits.
- **Rate limiting** — a minimal in-memory per-IP filter
  (`ratelimit/RateLimitFilter.java`) on `/api/auth/**` and
  `/api/public/bookings`. **Caveat: this is single-instance only**, same as
  the Node version's `express-rate-limit` was. If you run more than one
  backend instance behind a load balancer, replace this with a shared store
  (Redis + Bucket4j) so all instances enforce the same limit together.
- **NoSQL injection** doesn't apply here (relational DB + parameterized
  JPA queries), but I did keep `Specification`-based dynamic queries
  parameterized rather than building any raw SQL by string concatenation.

## Known gaps (same list as the Node version, still open)

- **Payments** — no gateway integration (Razorpay/Stripe). `Payment` entity
  exists but nothing calls out to a provider.
- **File uploads** — image fields are plain URL strings.
- **Email delivery** — password reset returns the raw token in the response
  body only outside the `prod` profile; in `prod` it's silently omitted
  until you wire up an email provider.
- **No automated integration tests** — only one unit test
  (`JwtServiceTest`, DB-free) is included. Given I can't compile-verify
  here, I deliberately didn't add a Testcontainers/H2 integration test
  suite I couldn't run myself — that would be false confidence. Once you've
  confirmed the app builds and boots, adding `@SpringBootTest` +
  Testcontainers-Postgres tests for auth, booking creation (price +
  double-booking), and branch scoping would be the highest-value next step.

## Deploying

```bash
docker compose up --build   # local, matches the container you'd ship
```
For a real deploy: build the image, push to a registry, run on
Render/Railway/Fly/ECS/etc. with env vars from `.env.example` (real
secrets), `DB_URL`/`DB_USERNAME`/`DB_PASSWORD` pointing at managed
Postgres (RDS, Neon, Supabase, etc.), and `SPRING_PROFILES_ACTIVE=prod`.
Point health checks at `/actuator/health` (or the split
`/actuator/health/liveness` and `/actuator/health/readiness` if your
platform supports separate probes).
