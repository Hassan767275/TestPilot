import pool from "./db";
import type { Finding } from "../lib/types";

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

export async function insertFindings(finding: Finding) {
  await pool.query(
    `
      INSERT INTO findings
      (test_id, severity, title, report)
      VALUES($1, $2, $3, $4)
    `,
    [
      finding.testId,
      finding.severity,
      finding.title,
      finding.report,
    ],
  );
}