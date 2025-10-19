# Deployment & CI/CD

## GitHub Actions workflows

- `.github/workflows/ci.yml` — runs on every push/PR. Steps:
  1. Check out repo, set up Node 20 + pnpm.
  2. `pnpm bootstrap`, `pnpm generate`, `pnpm lint`, and `pnpm --recursive build`.
  3. Starts `docker-compose.dev.yml` and executes `pnpm health-check` (retry up to 5 times).
  4. Tears down the stack (always).

- `.github/workflows/docker-publish.yml` — runs on pushes to `main` (and manually via workflow_dispatch).
  1. Builds production targets of `client/Dockerfile` and `server/Dockerfile`.
  2. Pushes images to GitHub Container Registry (`ghcr.io/<owner>/eazy-lingo-{client,server}`) tagged with `latest` and the commit SHA.

> Packages are published with the built-in `GITHUB_TOKEN`. Ensure repository visibility permits package publishing and, if using environments, grant the workflow `packages: write` access.

## Using published images locally

Once images are pushed, you can pull them via:

```bash
docker pull ghcr.io/<owner>/eazy-lingo-server:latest
docker pull ghcr.io/<owner>/eazy-lingo-client:latest
```

To run with compose, override the build sections:

```bash
docker compose \
  -f docker-compose.yml \
  --profile prod \
  up -d \
  --pull always \
  --build
```

Or create a `docker-compose.override.yml` pointing services to the remote images via `image:` fields.

## Next steps

- Add environment-specific tags (e.g., `staging`, `prod`) via deploy branches or manual dispatch inputs.
- Integrate automatic deployment to staging using the published images.
- Configure vulnerability scanning (e.g., `docker/scout-action` or Trivy) as an additional job.
