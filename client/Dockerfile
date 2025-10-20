# syntax=docker/dockerfile:1.6

ARG PNPM_VERSION=10.18.3

FROM node:20-slim AS base
WORKDIR /app
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG PNPM_VERSION
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare pnpm@${PNPM_VERSION} --activate

# ------------------------
# Dependencies
# ------------------------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json client/
RUN pnpm install --filter @eazy-lingo/client --frozen-lockfile --prod=false

# ------------------------
# Build
# ------------------------
FROM deps AS build
WORKDIR /app
COPY client ./client
RUN pnpm --filter @eazy-lingo/client run build

# ------------------------
# Dev
# ------------------------
FROM deps AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY client ./client
EXPOSE 3000
CMD ["pnpm", "--filter", "@eazy-lingo/client", "run", "dev"]

# ------------------------
# Production
# ------------------------
FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json client/
COPY client/next.config.mjs client/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY --from=build /app/client/.next ./client/.next
COPY --from=build /app/client/public ./client/public
EXPOSE 3000
CMD ["pnpm", "--filter", "@eazy-lingo/client", "start"]
