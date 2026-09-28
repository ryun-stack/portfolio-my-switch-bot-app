# syntax=docker/dockerfile:1
#
# Build context MUST be the monorepo root (not apps/api), e.g.:
#   docker build -f apps/api/Dockerfile -t my-switch-bot-app-api .
# This is required because apps/api depends on the npm workspace package
# @my-switch-bot-app/shared-types (packages/shared-types), which npm
# resolves via a symlink in the root node_modules (ADR.md 3.6.1/3.9).

# ---- Build stage ----------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Copy only the manifests first so `npm ci` is cached unless a
# package.json/package-lock.json actually changes. apps/client's manifest
# is included even though this image doesn't run the client, because `npm
# ci` validates the lockfile against every workspace declared in the root
# package.json and fails if one is missing.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/client/package.json apps/client/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json

RUN npm ci

# Only shared-types and api sources are needed to build this image.
COPY packages/shared-types packages/shared-types
COPY apps/api apps/api

RUN npm run build -w packages/shared-types \
  && npm run build -w apps/api \
  && npm prune --omit=dev

# ---- Runtime stage ---------------------------------------------------------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# node_modules is copied wholesale (not just apps/api/node_modules) because
# npm workspaces hoists dependencies into the root node_modules and links
# @my-switch-bot-app/shared-types there via a relative symlink to
# packages/shared-types — both must keep the same relative layout as the
# build stage for that symlink to resolve.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/packages/shared-types/package.json ./packages/shared-types/package.json
COPY --from=build /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
