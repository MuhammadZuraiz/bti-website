import { execSync } from "node:child_process";
import { Client } from "pg";
import { e2eDatabaseUrl } from "../playwright.config";

export default async function globalSetup() {
  const url = new URL(e2eDatabaseUrl);
  const databaseName = url.pathname.slice(1);

  const adminUrl = new URL(e2eDatabaseUrl);
  adminUrl.pathname = "/postgres";
  adminUrl.search = "";

  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();
  try {
    const existing = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [databaseName]
    );
    if (existing.rowCount === 0) {
      await client.query(`CREATE DATABASE "${databaseName}"`);
    }
  } finally {
    await client.end();
  }

  execSync("pnpm db:deploy", {
    env: { ...process.env, DATABASE_URL: e2eDatabaseUrl },
    stdio: "inherit"
  });
}
