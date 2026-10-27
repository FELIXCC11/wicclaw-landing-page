FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG WICCLAW_DEPLOYMENT_STAGE=production
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL WICCLAW_DEPLOYMENT_STAGE=$WICCLAW_DEPLOYMENT_STAGE
RUN pnpm build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/db ./db
COPY --from=builder --chown=node:node /app/scripts/migrate.mjs /app/scripts/retry-emails.mjs /app/scripts/launch-check.mjs ./scripts/
USER node
EXPOSE 3000
CMD ["node", "server.js"]
