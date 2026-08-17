# ============================================================================
# Multi-stage Dockerfile for Next.js apps (ÊM Clothing Commerce Platform)
# ============================================================================
# Build args: APP_DIR (e.g. "apps/api", "apps/storefront", "apps/admin")
# Security: non-root user, minimal final image
# ============================================================================

# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/${APP_DIR}/package.json apps/${APP_DIR}/package.json
COPY packages/ packages/
COPY contracts/ contracts/

# Install dependencies with bun
RUN corepack enable && corepack prepare bun@1.3.14 --activate
RUN bun install --frozen-lockfile

# --- Stage 2: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time env
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client if needed
RUN corepack enable && corepack prepare bun@1.3.14 --activate
RUN cd packages/db && bun run db:generate

# Build the app
RUN bun run build --filter=${APP_DIR}

# --- Stage 3: Production runner ---
FROM node:20-alpine AS runner
WORKDIR /app

# Security: non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set build-time env
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy built assets
COPY --from=builder /app/apps/${APP_DIR}/public ./public
COPY --from=builder /app/apps/${APP_DIR}/.next/standalone ./
COPY --from=builder /app/apps/${APP_DIR}/.next/static ./.next/static

# Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/packages/db/prisma ./prisma

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
