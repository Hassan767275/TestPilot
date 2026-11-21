import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const client = new OpenAI();

const findings = z.object({
  severity: z.enum(["none", "low", "medium", "high"]),
  report: z.string(),
});

export async function generateReport(testResults: any) {
  return await client.responses.parse({
    model: "gpt-6-luna",
    input: `You are a LLM that is responsible for generating reports for websites the worker has already tested. The worker has sent you the results of the site it tested. It is your responsiblity to generate a report of all findings so that users can see what is working and what is not working on their site. Your report should be insighful and caterted towards developers since developers will be the ones who want to know if there is any issue with there site that they developed. Here is the test results: ${JSON.stringify(testResults)}`,
    text: {
      format: zodTextFormat(findings, "findings"),
    },
  });
}

// make sure to create a type for test results