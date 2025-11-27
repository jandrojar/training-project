import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Postgres Adapter for Prisma Client
const pgAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter: pgAdapter });

console.log("DB URL:", process.env.DATABASE_URL);


export default prisma;
