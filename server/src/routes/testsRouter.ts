import { Router } from "express";
import { createTest, getTest, getResults } from "../controllers/tests";

const testsRouter = Router()

testsRouter.post("/", createTest)
testsRouter.get("/", getTest)
testsRouter.get("/:test_id/results", getResults)

export default testsRouter