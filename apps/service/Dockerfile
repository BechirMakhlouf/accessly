# syntax=docker/dockerfile:1.7

# ---------------------------------------------------------------------------
# Base image
# ---------------------------------------------------------------------------
FROM node:25-slim AS base

ENV PNPM_HOME="/pnpm" \
  PNPM_STORE_PATH="/pnpm/store" \
  PATH="/pnpm:${PATH}"

WORKDIR /repo

RUN npm install -g pnpm@10.26.2

# ---------------------------------------------------------------------------
# Builder stage: install deps and build
# ---------------------------------------------------------------------------
FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY tsconfig.json ./tsconfig.json
COPY apps/service apps/service
COPY packages packages

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @accessly/service...

# Build
RUN pnpm --filter @accessly/service build

# ---------------------------------------------------------------------------
# Runtime stage: minimal production image
# ---------------------------------------------------------------------------
FROM node:25-slim AS runtime

ENV NODE_ENV=production \
  PORT=8080

WORKDIR /app

COPY --from=builder --chown=node:node /repo/apps/service/dist/index.cjs ./

USER node

EXPOSE 8080
CMD ["node", "index.cjs"]
