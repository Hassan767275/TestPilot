import { Router } from "express";
import { createTest, getTest } from "../controllers/tests";

const testsRouter = Router()

testsRouter.post("/tests", createTest)
testsRouter.get("/tests", getTest)

export default testsRouter