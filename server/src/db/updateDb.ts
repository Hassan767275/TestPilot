import pool from "./db";

export async function updateRow(id: string, status: "complete" | "failed") {
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
