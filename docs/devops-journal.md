# DevOps Journal

## 2025-10-16 — Baseline assessment
- Captured project layout: separate `client/` (Next.js) and `server/` (NestJS) packages, independent `pnpm` installs.
- Created `docs/env.sample.md` to document required environment variables with safe defaults.
- Wrote `docs/manual-run.md` describing manual setup, migrations, and runtime checks.
- Observed mixed lockfiles (`package-lock.json`, `pnpm-lock.yaml`); plan to standardize on pnpm in a later milestone.
- Next focus: introduce Dockerized development environment to remove local Postgres dependency and unify start commands.

## 2025-10-17 — Containerization scaffolding
- Added multi-stage Dockerfiles for `server/` and `client/` with dedicated `dev` and `prod` targets (Node 20 slim + pnpm).
- Created `.dockerignore` files to keep build contexts lean.
- Produced `docker-compose.dev.yml` (watch mode, local volumes) and `docker-compose.yml` (production-like) with Postgres service and healthchecks.
- Documented compose usage in `docs/manual-run.md` and codified assumptions in `docs/container-plan.md`.
- Updated `client/pnpm-lock.yaml` to resolve `pnpm install --frozen-lockfile` failures during Docker builds and verified the deps stage builds cleanly.
- Patched `server/Dockerfile` to install OpenSSL/`libssl3` so Prisma migrations run successfully inside containers.
- Restricted Prisma `binaryTargets` to `["native", "debian-openssl-3.0.x"]` to ensure the client ships a Debian-compatible engine for containers.
- Assigned distinct image tags for dev (`:dev`) and prod (`:prod`) compose stacks to prevent target mix-ups when switching workflows.
- Added lightweight `/api/health` controller leveraged by Docker healthchecks (enabled `curl` in the server image and wired `docker-compose*.yml` checks).
- Enabled global NestJS prefix `/api` so client calls align with compose configuration and health probes.
- Made Google OAuth callback configurable via `GOOGLE_CALLBACK_URL` (defaults to `/api/auth/google/redirect`) and documented the update.
- Remaining work: test the Compose stacks end-to-end and refine migration workflow (consider one-off job or entrypoint script).
