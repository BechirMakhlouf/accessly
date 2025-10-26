# syntax=docker/dockerfile:1.7

FROM node:20-slim AS base

ENV PNPM_HOME=/pnpm
ENV PNPM_STORE_PATH=/pnpm/store
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /repo

FROM base AS deps

WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/service/package.json apps/service/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json

RUN pnpm fetch --filter @accessly/service...

FROM base AS builder

WORKDIR /repo

COPY --from=deps /pnpm/store /pnpm/store

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY tsconfig.json ./tsconfig.json
COPY apps/service apps/service
COPY packages packages

RUN pnpm install --offline --frozen-lockfile --filter @accessly/service...
RUN pnpm --filter @accessly/service... build
RUN pnpm deploy --filter @accessly/service --prod /deploy/service

FROM node:20-slim AS runtime

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=builder --chown=node:node /deploy/service ./

USER node

EXPOSE 8080
CMD ["node", "dist/index.js"]
