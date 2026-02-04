import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
dotenv.config();

// Required for WebSockets to work in Node.js/Docker
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
});

export default prisma;
