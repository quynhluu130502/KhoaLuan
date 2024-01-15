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

import connectDatabase from "./configs/connectDatabase";
connectDatabase();

import routes from "./routes/userRoutes";
app.use("/user", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
