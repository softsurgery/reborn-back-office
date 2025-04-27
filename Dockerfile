# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies (but need prisma files first)
COPY package.json yarn.lock ./

# 👇 Copy only prisma files first
COPY prisma ./prisma

RUN apt-get update && apt-get install -y python3 g++ make

# Now install
RUN yarn install --ignore-scripts --frozen-lockfile

# 🛠 Generate Prisma Client
RUN yarn prisma generate 

# Now copy the rest of the app
COPY . .

# Build the app
RUN yarn build

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

# If prisma client needed at runtime
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD printenv && yarn start