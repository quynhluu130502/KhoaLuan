import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
app.use(express.json());

import morgan from "morgan";
var env: string = process.env.NODE_ENV || "development";
if (env !== "production") {
  app.use(morgan("combined"));
}

import cors from "cors";
app.use(cors({
  origin: [process.env.CLIENT_URL || ""], // Provide a default value when process.env.CLIENT_URL is undefined
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

import connectDatabase from "./configs/connectDatabase";
connectDatabase();

import userRoutes from "./routes/userRoutes";
app.use("/user", userRoutes);

import ncgRoutes from "./routes/ncgRoutes";
app.use("/ncg", ncgRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
