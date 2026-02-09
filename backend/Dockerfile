FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install && npm install -g tsx

COPY . .

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && tsx src/app.ts"]
