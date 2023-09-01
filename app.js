import express from "express";
import userRouter from "./routes/user.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

export const app = express();

//connecting db from dotenc file
config({
  path: "./data/config.env",
});
//using middleware to access the json data
app.use(express.json()); //use first
app.use(cookieParser());

//using route

app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Nice Working");
});
