FROM oven/bun:1 AS base
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

ENV API_URL=http://backend:3000

CMD ["bun", "run", "src/index.ts"]

