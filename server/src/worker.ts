import "dotenv/config";
import pool from "./db/db";
import { chromium } from "playwright";
import type { Data } from "@/shared/types";

async function pollDatabase() {
  try {
    const { rows } = await pool.query(
      `SELECT id, url, status, created_at FROM tests
    where status = 'pending'`,
    );

    for (const row of rows) {
      await visitSite(row);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  } finally {
    setTimeout(pollDatabase, 1000);
  }
}

async function visitSite(row: Data) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(row.url);
  await page.screenshot({ path: `screenshots/${row.id}.png` });
  await browser.close();
}

pollDatabase();
