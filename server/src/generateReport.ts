import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import type { TestResults } from "./lib/types";

const client = new OpenAI();

const findings = z.object({
  report: z.string(),
  severity: z.enum(["none", "low", "medium", "high"]),
});

export async function generateReport(testResults: TestResults | string) {
  return await client.responses.parse({
    model: "gpt-6-luna",
    input: [
      {
        role: "system",
        content: `
          You are a QA engineer writing a test report for a website that an automated browser just tested. Your reader is the developer who built the site.

          Write the report in markdown:
          1. Start with a one or two sentence summary of the site's overall health.
          2. List each issue you found, with the evidence (the exact URL, status code, or error message) and a likely fix.
          3. Briefly note what is working.

          Only report issues that are supported by the test results. Do not invent problems. If a field is null or missing, it means that data wasn't available, not that something failed, unless the results say otherwise.

          Choose ONE overall severity for the site:
          - high: the site is unusable. It could not be reached (DNS, SSL, timeout, connection error) or the main page returned a 5xx status (the server itself is failing).
          - medium: the page loads but something users would notice is broken, such as uncaught JavaScript errors or failed scripts, stylesheets, or API requests.
          - low: minor problems, such as broken images or non-critical assets, console errors with no visible impact, missing security headers, or no HTTPS. Also use low when the requested URL returned a 4xx status: the server is up, but that path doesn't exist, which usually means a wrong or outdated link. Say this in the report.
          - none: only when there are no issues at all. Never use none if the requested URL returned a 4xx or 5xx status.

          If the test results are a plain error message instead of an object, the site could not be reached. Explain what the error means in plain terms and how the developer could fix it. Judge the site only by the test results. Never assume an error status was intended.`,
      },
      {
        role: "user",
        content: `Test results: ${JSON.stringify(testResults)}`,
      },
    ],
    text: {
      format: zodTextFormat(findings, "findings"),
    },
  });
}
