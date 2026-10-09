import { Router } from "express";
import { createTest, getTest } from "../controllers/tests";

const authRouter = Router()

authRouter.post("/tests", createTest)
authRouter.get("/tests", getTest)

export default authRouter