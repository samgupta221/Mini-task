import mysql, { type Pool } from "mysql2/promise";

const globalForDb = globalThis as unknown as { mysqlPool?: Pool };

function createPool(): Pool {
  return mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "task_board",
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: false,
  });
}

export const pool: Pool = globalForDb.mysqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = pool;
}
