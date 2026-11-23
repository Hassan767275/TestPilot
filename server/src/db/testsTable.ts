import pool from "./db";

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
  console.log(`row ${id} updated status: ${status}`);
}