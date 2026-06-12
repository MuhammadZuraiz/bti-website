import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { isProductionRuntime } from "@/config/env.server";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const localDatabaseUrl =
  "postgresql://bti:bti_local_password@localhost:5432/bti_website?schema=public";

function resolveConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (isProductionRuntime()) {
    throw new Error("DATABASE_URL is required in production.");
  }

  return localDatabaseUrl;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: resolveConnectionString()
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"]
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
