import { Request, Response } from "express";
import pool from "../db/db";
import { myQueue } from "../queue";

export async function createTest(req: Request, res: Response) {
  const { url } = req.body;

  if (!url || url.trim() === "") {
    return res.status(400).json({ message: "A URL is required." });
  }

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

  if (!urlRegex.test(url)) {
    return res.status(400).json({ message: "A URL is required." });
  }

  let result;
  try {
    result = await pool.query(
      `
        INSERT INTO tests
        (url, status)
        VALUES($1, $2)
        RETURNING id, status
        `,
      [url, "pending"],
    );
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }

  const { id, status } = result?.rows[0];
  await myQueue.add("testUrl", { id });

  return res.status(200).json({ testId: id, status });
}

export async function getTest(req: Request, res: Response) {
  let data;
  try {
    data = await pool.query(
      `SELECT id, url, status, TO_CHAR(created_at, 'FMMonth DD, YYYY') as created_at FROM TESTS`,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).json({ message: "unable to fetch data" });
  }
  return res.status(200).json({ data: data.rows });
}
