import pool from "./db";
import type { Finding } from "../lib/types";

export async function insertFindings(finding: Finding) {
  await pool.query(
    `
      INSERT INTO findings
      (test_id, severity, title, report)
      VALUES($1, $2, $3, $4)
    `,
    [finding.testId, finding.severity, finding.title, finding.report],
  );
}

export async function getFindings(test_id: string) {
  return await pool.query(
    `
    SELECT test_id, severity, title, report
    FROM findings
    where test_id=$1
    `,
    [test_id],
  );
}
