import "dotenv/config";
import pool from "./db/db";

async function pollDatabase() {
  try {
    const { rows } = await pool.query(
      `SELECT status FROM tests
    where status = 'pending'`,
    );

    for (const row of rows) {
      console.log(`reading progress brochacho : ${row.status}`);
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  } finally {
    setTimeout(pollDatabase, 1000)
  }
}

pollDatabase()
