import { chromium } from "playwright";
import type { Data } from "@/shared/types";
import type {
  ConsoleError,
  PageError,
  FailedRequest,
  BadRequest,
} from "./lib/types";
import { updateRow } from "./db/updateDb";

export async function testSite(row: Data) {
  const browser = await chromium.launch();
  try {
    const consoleErrors: ConsoleError[] = [];
    const pageErrors: PageError[] = [];
    const failedRequests: FailedRequest[] = [];
    const badResponses: BadRequest[] = [];

    const page = await browser.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push({
          text: msg.text(),
          location: msg.location().url,
        });
      }
    });
    page.on("pageerror", (err) => {
      pageErrors.push({
        message: err.message,
        stack: err.stack,
      });
    });
    page.on("requestfailed", (req) => {
      failedRequests.push({
        url: req.url(),
        resourceType: req.resourceType(),
        error: req.failure()?.errorText,
      });
    });
    page.on("response", (res) => {
      if (res.status() >= 400) {
        badResponses.push({
          url: res.url(),
          status: res.status(),
          resourceType: res.request().resourceType(),
        });
      }
    });
    let response;
    try {
        response = await page.goto(row.url);
    } catch (error) {
        await updateRow(row.id, "failed");
        if (error instanceof Error) {
            return error.message
        }
    }
    const path = `../shared/screenshots/${row.id}.png`;
    await page.screenshot({ path });

    if (response?.ok()) {
      await updateRow(row.id, "complete");
    } else {
      await updateRow(row.id, "failed");
    }

    const redirectChain = [];
    let currentRequest = response?.request() ?? null;

    while (currentRequest) {
      redirectChain.push(currentRequest.url());
      currentRequest = currentRequest.redirectedFrom();
    }

    const timingPage = await page.evaluate(() => {
      return performance
        .getEntriesByType("navigation")[0]
        ?.toJSON() as PerformanceNavigationTiming;
    });

    const timing = timingPage
      ? {
          dnsMs: timingPage?.domainLookupEnd - timingPage?.domainLookupStart,
          tlsMs:
            timingPage.secureConnectionStart > 0
              ? timingPage.connectEnd - timingPage.secureConnectionStart
              : null,
          ttfbMs: timingPage.responseStart - timingPage.requestStart,
          documentMs: timingPage.responseEnd - timingPage.responseStart,
          domContentLoadedMs: timingPage.domContentLoadedEventEnd,
          loadMs: timingPage.loadEventEnd,
        }
      : null;

    const testResults = {
      testId: row.id,
      requestedUrl: row.url,
      finalUrl: response?.url(),
      status: response?.status(),
      statusText: response?.statusText(),
      redirectChain: redirectChain.reverse(),
      pageTitle: await page.title(),
      headers: await response?.allHeaders(),
      timing,
      consoleErrors,
      pageErrors,
      failedRequests,
      badResponses,
      screenshotPath: path,
    };

    return testResults;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    await updateRow(row.id, "failed");
  } finally {
    await browser.close();
  }
}