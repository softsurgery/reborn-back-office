FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
COPY .env.build .env.build

# ✅ Build Next.js app using public env vars
RUN export $(grep ^NEXT_PUBLIC_ .env.build | xargs) && yarn build

# ---- Production image ----
FROM gcr.io/distroless/nodejs20-debian12 AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node_modules/next/dist/bin/next", "start"]