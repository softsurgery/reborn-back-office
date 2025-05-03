FROM node:20-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN apt-get update \
  && apt-get install -y python3 g++ make \
  && yarn install --ignore-scripts --frozen-lockfile \
  && apt-get purge -y python3 g++ make \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

COPY prisma ./prisma
RUN yarn prisma generate

COPY . .

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /uploads/reborn

EXPOSE 3000

CMD ["yarn", "start"]
