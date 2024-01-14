import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const mongoString: string = process.env.DATABASE_URL!;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error: any) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

import routes from "./routes/routes";
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
