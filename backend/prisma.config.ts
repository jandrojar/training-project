import "dotenv/config";
import { defineConfig } from "prisma/config";

// `DATABASE_URL` is read straight from the environment (not prisma's strict
// `env()` helper) so that `prisma generate` works without a database URL — it
// only needs the schema. Commands that hit the database (`migrate`, `studio`)
// still fail clearly when it is missing.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
