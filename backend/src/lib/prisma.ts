import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config();


const adapter = process.env.DB_TYPE === "PG"
    ? new PrismaPg({ connectionString: process.env.DATABASE_URL })
    : new PrismaNeon({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
});

export default prisma;
