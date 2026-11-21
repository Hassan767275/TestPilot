import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { testSite } from "./testSite";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import pool from "./db/db";
import { updateRow } from "./db/updateDb";

const connection = new IORedis({ maxRetriesPerRequest: null });
const client = new OpenAI();

const findings = z.object({
  severity: z.enum(["none", "low", "medium", "high"]),
  report: z.string(),
});

const worker = new Worker(
  "tests",
  async (job) => {
    const testResults = await testSite(job.data);

    if (!testResults) {
      return;
    }

    let response;
    try {
      response = await client.responses.parse({
        model: "gpt-6-luna",
        input: `You are a LLM that is responsible for generating reports for websites the worker has already tested. The worker has sent you the results of the site it tested. It is your responsiblity to generate a report of all findings so that users can see what is working and what is not working on their site. Your report should be insighful and caterted towards developers since developers will be the ones who want to know if there is any issue with there site that they developed. Here is the test results: ${JSON.stringify(testResults)}`,
        text: {
          format: zodTextFormat(findings, "findings"),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return await updateRow(job.data.id, "error");
    }

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
