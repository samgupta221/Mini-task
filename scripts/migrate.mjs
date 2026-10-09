import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadEnvFile(name) {
  try {
    const content = await readFile(path.join(root, name), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2];
      }
    }
  } catch {

  }
}

await loadEnvFile(".env.local");
await loadEnvFile(".env");

const dbName = process.env.DB_NAME ?? "task_board";
if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
  console.error(`Invalid DB_NAME "${dbName}". Use letters, numbers and underscores only.`);
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  multipleStatements: true,
});

try {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4`
  );
  await connection.query(`USE \`${dbName}\``);

  const schema = await readFile(path.join(root, "db", "schema.sql"), "utf8");
  await connection.query(schema);
  console.log("Schema applied.");

  if (process.argv.includes("--seed")) {
    const [rows] = await connection.query("SELECT COUNT(*) AS total FROM tasks");
    if (rows[0].total > 0) {
      console.log("tasks table already has data, skipping seed.");
    } else {
      const seed = await readFile(path.join(root, "db", "seed.sql"), "utf8");
      await connection.query(seed);
      console.log("Seed data inserted.");
    }
  }
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
