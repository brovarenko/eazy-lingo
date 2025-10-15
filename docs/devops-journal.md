# DevOps Journal

## 2025-10-16 — Baseline assessment
- Captured project layout: separate `client/` (Next.js) and `server/` (NestJS) packages, independent `pnpm` installs.
- Created `docs/env.sample.md` to document required environment variables with safe defaults.
- Wrote `docs/manual-run.md` describing manual setup, migrations, and runtime checks.
- Observed mixed lockfiles (`package-lock.json`, `pnpm-lock.yaml`); plan to standardize on pnpm in a later milestone.
- Next focus: introduce Dockerized development environment to remove local Postgres dependency and unify start commands.
