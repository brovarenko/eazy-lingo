# Manual Runbook

This guide explains how to start the application stack on a local machine without Docker.

## 1. Prerequisites

- Node.js 20 LTS (install via nvm, fnm, or the official installer).
- pnpm `>=8` (install with `npm install -g pnpm` after Node is set up).
- PostgreSQL 14+ running locally, or access to a remote Postgres instance.
- Optional tooling that helps with debugging: `psql` or `pgcli`.

## 2. Prepare environment variables

1. Copy `docs/env.sample.md` into the real files:
   - `client/.env`
   - `server/.env`
2. Replace the placeholder values with credentials that exist in your environment.
3. Ensure the `DATABASE_URL` points to a database you can reach; create the database manually if it does not exist.

## 3. Install dependencies

Run the commands below from the project root:

```bash
cd server
pnpm install

cd ../client
pnpm install
```

> Keep the server and client node versions in sync (Node 20 LTS).

## 4. Database migrations & seed

From the `server/` folder run:

```bash
pnpm prisma migrate dev
pnpm prisma db seed   # optional: only if a seed script exists and you want demo data
```

Confirm the target database received the schema (check tables via `psql`).

## 5. Run backend

```bash
cd server
pnpm run start:dev
```

The NestJS API should listen on `http://localhost:4000` (adjust if the project uses a different port).

## 6. Run frontend

```bash
cd client
pnpm run dev
```

The Next.js client should become available at `http://localhost:3000`.

## 7. Health checks

- Visit `http://localhost:3000` and confirm the UI renders.
- Call `http://localhost:4000/api/health` (or an equivalent ping endpoint) and ensure it returns a success status.
- Inspect the browser console and server logs for errors.

Document any deviations or fixes in `docs/devops-journal.md` so we can automate them later.

---

## Appendix: Run with Docker (preview)

Until we automate everything in CI, you can launch the stack with Docker Compose:

```bash
# Development (hot reload)
docker compose -f docker-compose.dev.yml up --build

# Production-like build
docker compose up --build
```

Prerequisites:

- Copy the `.env` files as described above (compose reads them).
- Ensure ports `3000`, `4000`, and `5432` are free.
- When switching between dev and prod stacks, rebuild to refresh the image target:
  - `docker compose -f docker-compose.dev.yml build`
  - `docker compose build`

Health checks are the same as in section 7. Use `docker compose down -v` to stop and remove containers with volumes.
