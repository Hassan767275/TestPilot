import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth";

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  console.log("got the request from frontend");
  return res.status(200).json({ message: "request recieved" });
});

app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
