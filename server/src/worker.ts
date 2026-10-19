import "dotenv/config"
import pool from "./db/db";

async function pollDatabase() {
  const rows = await pool.query(
    `SELECT status FROM tests
    where status = 'pending'`,
  );
  console.log(rows)
}


pollDatabase()