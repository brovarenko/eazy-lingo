# Containerization Baseline

## Runtime assumptions
- Node.js 20 LTS base image (Debian-slim) for predictable glibc support across Next.js and NestJS. The server image additionally installs `openssl`, `libssl3`, and CA certificates for Prisma compatibility.
- Package manager: workspace-managed `pnpm` (installed via corepack inside the containers, shared lockfiles per package).
- Shared network: backend listens on port `4000`, frontend on `3000`; PostgreSQL exposed on `5432`.
- Prisma needs `prisma generate` and migrations before the server starts; migrations will run as part of the compose workflow.
- Environment variables come from `client/.env` and `server/.env`; compose will map them using `.env` files in the respective folders.
- Backend exposes `GET /api/health` for container health probes; images include `curl` for the Docker healthcheck command.
- NestJS uses a global prefix `/api`, so client requests and health probes should always target `/api/*` paths.
- Google OAuth callback must match the backend prefix (default `http://localhost:4000/api/auth/google/redirect` via `GOOGLE_CALLBACK_URL`).
- Added `scripts/health-check.js` (run via `pnpm health-check`) to perform API/client probes locally and in CI.

## Targets
1. Dockerfile for `server/` supporting development (watch mode) and production (build + run).
2. Dockerfile for `client/` focused on production build; dev mode will use host Node for faster refresh (optional).
3. `docker-compose.dev.yml` orchestrating Postgres, server, and client for local development (builds images tagged `eazy-lingo-*:dev` to avoid cache clashes with prod images).
4. `docker-compose.yml` (production-like) building images, running migrations, and starting containers without watch modes (tagged `eazy-lingo-*:prod`).

## Open points
- Decide if we keep both npm and pnpm lockfiles; plan is to standardize on pnpm after confirming team agreement.
- Validate that Prisma binaries in `node_modules/.prisma` are compatible with Debian-slim (should be handled automatically).
- For dev workflow we may mount volumes to persist `node_modules` or rely on cache layers (to be tested).
