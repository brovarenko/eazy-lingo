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
COPY server/package.json server/
RUN pnpm install --filter @eazy-lingo/server --frozen-lockfile --prod=false

# ------------------------
# Build
# ------------------------
FROM deps AS build
WORKDIR /app
COPY server ./server
RUN pnpm --filter @eazy-lingo/server exec prisma generate

RUN pnpm --filter @eazy-lingo/server run build

# ------------------------
# Dev
# ------------------------
FROM deps AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY server ./server
RUN pnpm --filter @eazy-lingo/server exec prisma generate

EXPOSE 4000
CMD ["pnpm", "--filter", "@eazy-lingo/server", "run", "start:dev"]

# ------------------------
# Production
# ------------------------
FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/dist ./server/dist
COPY server/prisma ./server/prisma
EXPOSE 4000
CMD ["node", "server/dist/src/main.js"]
