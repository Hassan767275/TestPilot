import "dotenv/config";
import pool from "./db/db";
import { chromium } from "playwright";
import type { Data } from "@/shared/types";
import { Worker } from "bullmq";
import IORedis from 'ioredis'

const connection = new IORedis({ maxRetriesPerRequest: null})

const worker = new Worker(
  'tests',
  async job => {
    await testSite(job.data)
  },
  { connection },
)

async function testSite(row: Data) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const response = await page.goto(row.url);
    await page.screenshot({ path: `screenshots/${row.id}.png` });

    if (response?.ok()) {
      await updateRow(row.id, "complete");
    } else {
      await updateRow(row.id, "error");
    }
  } catch (error) {
    if (error instanceof Error){
      console.log(error.message)
    }
    await updateRow(row.id, "error");
  } finally {
    await browser.close();
  }
}

async function updateRow(id: string, status: "complete" | "error") {
  await pool.query(
    `
    UPDATE tests
    SET status = $1
    WHERE id = $2
    `,
    [status, id],
  );
  console.log(`row ${id} updated status: ${status}`)
}

