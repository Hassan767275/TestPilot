import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { testSite } from "./testSite";
import pool from "./db/db";
import { updateRow } from "./db/updateDb";
import { generateReport } from "./generateReport";

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "tests",
  async (job) => {
    const testResults = await testSite(job.data);

    if (!testResults) {
      return;
    }

    let response;
    try {
      response = await generateReport(testResults)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return await updateRow(job.data.id, "error");
    }
    // dont forget to move the db query into its own file
    console.log(response.output_parsed);

    if (response.output_parsed) {
      try {
        await pool.query(
          `
            INSERT INTO findings
            (test_id, severity, title, report)
            VALUES($1, $2, $3, $4)
          `,
          [
            job.data.id,
            response.output_parsed.severity,
            `Report for ${job.data.url}`,
            response.output_parsed.report,
          ],
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        await updateRow(job.data.id, "error");
      }
    } else {
      await updateRow(job.data.id, "error");
    }
  },
  { connection },
);
