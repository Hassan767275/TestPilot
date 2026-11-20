import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { testSite } from "./testSite";
import OpenAI from "openai";

const connection = new IORedis({ maxRetriesPerRequest: null });
const client = new OpenAI();

const worker = new Worker(
  "tests",
  async (job) => {
    const testResults = await testSite(job.data);

    if (!testResults) {
      return;
    }

    const response = await client.responses.create({
      model: "gpt-6-luna",
      input: `You are a LLM that is responsible for generating reports for websites the worker has already tested. The worker has sent you the results of the site it tested. It is your responsiblity to generate a report of all findings so that users can see what is working and what is not working on their site. Your report should be insighful and caterted towards developers since developers will be the ones who want to know if there is any issue with there site that they developed. Here is the test results: ${JSON.stringify(testResults)}`,
    });
    console.log(response.output_text)
  },
  { connection },
);
