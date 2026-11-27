import pool from "./db";

export async function insertTest(url: string, status: string) {
  return await pool.query(
    `
      INSERT INTO tests
      (url, status)
      VALUES($1, $2)
      RETURNING id, url, status, created_at
      `,
    [url, status],
  );
}

export async function updateStatus(
  id: string,
  status: "complete" | "failed" | "error",
) {
  await pool.query(
    `
    UPDATE tests
    SET status = $1
    WHERE id = $2
    `,
    [status, id],
  );
}

export async function getTests() {
  return await pool.query(`SELECT id, url, status, created_at FROM TESTS`);
}
