import { Request, Response } from "express";
import pool from "../db/db";
import { myQueue } from "../queue";
import { insertTest, getTests } from "../db/testsTable";

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
    result = await insertTest(url, "pending")
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }

  const row = result?.rows[0];
  await myQueue.add("testUrl", row);
  
  return res.status(200).json({ row });
}

export async function getTest(req: Request, res: Response) {
  let data;
  try {
    data = await getTests()
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).json({ message: "unable to fetch data" });
  }
  return res.status(200).json({ data: data.rows });
}
