# syntax=docker/dockerfile:1.7
# Build stage: install deps (cached) and build the app
FROM oven/bun:1-slim AS build
WORKDIR /usr/src/app

# Copy only manifests first to maximize Docker layer cache
# Support both new text lockfile (bun.lock) and older bun.lockb
COPY package.json bun.lock* ./

# Speed up installs on rebuilds with BuildKit cache; requires DOCKER_BUILDKIT=1
# Use --frozen-lockfile for reproducible installs
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile

# Copy the rest of the source and build to ./out via your script
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Runtime stage: minimal image, non-root, only built artifacts
FROM oven/bun:1-slim AS runtime
WORKDIR /usr/src/app

# Keep runtime lean: only built output (and any runtime assets if needed)
COPY --from=build --chown=bun:bun /usr/src/app/out ./out
COPY --from=build --chown=bun:bun /usr/src/app/package.json ./package.json

# App config
ENV NODE_ENV=production
ENV PORT=8080
# Declare envs so they're discoverable; pass real values at runtime
ENV SUPABASE_URL=""
ENV SUPABASE_SECRET_KEY=""

# Security: run as the least-privileged built-in 'bun' user
USER bun

EXPOSE 8080
ENTRYPOINT ["bun", "run", "./out/index.js"]
