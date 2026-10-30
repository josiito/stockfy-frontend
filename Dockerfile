FROM node:24-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# Dependencias (se cachean mientras no cambie el lockfile)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build. No necesita el backend: los datos se piden en cada petición.
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public && pnpm build

# Imagen final: solo el servidor standalone, sin node_modules completos
FROM node:24-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public

USER nextjs
EXPOSE 3000

# API_URL se lee al arrancar, no al construir: la misma imagen vale para
# cualquier entorno.
CMD ["node", "server.js"]
