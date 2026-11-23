export interface ConsoleError {
  text: string;
  location: string;
}

export interface PageError {
  message: string;
  stack: string | undefined;
}

export interface FailedRequest {
  url: string;
  resourceType: string;
  error: string | undefined;
}

export interface BadResponse {
  url: string;
  status: number;
  resourceType: string;
}

interface TimingPage {
  dnsMs: number;
  tlsMs: number | null;
  ttfbMs: number;
  documentMs: number;
  domContentLoadedMs: number;
  loadMs: number;
}

export interface TestResults {
  testId: string;
  requestedUrl: string;
  finalUrl: string | undefined;
  status: number | undefined;
  statusText: string | undefined;
  redirectChain: string[];
  pageTitle: string;
  headers: Record<string, string> | undefined;
  timing: TimingPage | null;
  consoleErrors: ConsoleError[];
  pageErrors: PageError[];
  failedRequests: FailedRequest[];
  badResponses: BadResponse[];
  screenshotPath: string;
}

export interface Finding {
  testId: string;
  severity: "none" | "low" | "medium" | "high";
  title: string;
  report: string;
}
