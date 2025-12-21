# syntax=docker/dockerfile:1.7

# ---------------------------------------------------------------------------
# Base image: configure a consistent Node.js + pnpm toolchain for all stages.
# ---------------------------------------------------------------------------
FROM node:25-slim AS base

ARG PNPM_VERSION=9.0.0

ENV PNPM_HOME="/pnpm" \
  PNPM_STORE_PATH="/pnpm/store" \
  PATH="/pnpm:${PATH}"

RUN corepack enable \
  && corepack prepare "pnpm@${PNPM_VERSION}" --activate

WORKDIR /repo

# ---------------------------------------------------------------------------
# Dependencies stage: pre-fetch workspace packages to warm the pnpm store.
# ---------------------------------------------------------------------------
FROM base AS deps

COPY apps/service/package.json apps/service/package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages packages

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm fetch --filter @accessly/service...

# ---------------------------------------------------------------------------
# Build stage: install, compile, and create a pruned production bundle.
# ---------------------------------------------------------------------------
FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY tsconfig.json ./tsconfig.json
COPY apps/service apps/service
COPY packages packages

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --offline --frozen-lockfile --filter @accessly/service...
RUN pnpm --filter @accessly/service --prod build
RUN pnpm deploy --filter @accessly/service --prod /deploy/service

# ---------------------------------------------------------------------------
# Runtime stage: minimal image containing only the production artifacts.
# ---------------------------------------------------------------------------
FROM node:25-slim AS runtime

ENV NODE_ENV=production \
  PORT=8080

WORKDIR /app

COPY --from=builder --chown=node:node /deploy/service ./

USER node

EXPOSE 8080
CMD ["node", "dist/index.js"]
