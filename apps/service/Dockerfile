# Build stage
FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy monorepo root files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy all apps and packages from the context (the build context is the repo root)
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

RUN pnpm turbo build --filter=@accessly/service

# Production stage
FROM node:22-slim AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/service/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.cjs"]
