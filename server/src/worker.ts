import "dotenv/config";
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
