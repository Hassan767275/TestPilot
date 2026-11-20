import "dotenv/config";
import pool from "./db/db";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { testSite } from "./testSite";

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "tests",
  async (job) => {
    await testSite(job.data);
  },
  { connection },
);


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
