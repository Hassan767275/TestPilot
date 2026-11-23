import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { testSite } from "./testSite";
import { updateStatus, insertFindings } from "./db/updateDb";
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
      response = await generateReport(testResults);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return await updateStatus(job.data.id, "error");
    }

    if (response.output_parsed) {
      try {
        const finding = {
          testId: job.data.id,
          severity: response.output_parsed.severity,
          title: `Report for ${job.data.url}`,
          report: response.output_parsed.report,
        };

        await insertFindings(finding);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        await updateStatus(job.data.id, "error");
      }
    } else {
      await updateStatus(job.data.id, "error");
    }
  },
  { connection },
);
