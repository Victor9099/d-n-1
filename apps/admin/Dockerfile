# Multi-stage Dockerfile — Admin (see apps/api/Dockerfile for base)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json bun.lockb ./
COPY apps/admin/package.json apps/admin/package.json
COPY packages/ packages/
COPY contracts/ contracts/
RUN corepack enable && corepack prepare bun@1.3.14 --activate
RUN bun install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN corepack enable && corepack prepare bun@1.3.14 --activate
RUN cd packages/db && bun run db:generate
RUN bun run build --filter=admin

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002
COPY --from=builder /app/apps/admin/public ./public
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./.next/static
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3002
CMD ["node", "server.js"]
