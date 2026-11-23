import pool from "./db";
import type { Finding } from "../lib/types";

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