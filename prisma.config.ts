import { defineConfig } from "prisma/config";

const localDatabaseUrl =
  "postgresql://bti:bti_local_password@localhost:5432/bti_website?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: process.env.DATABASE_URL ?? localDatabaseUrl
  }
});
