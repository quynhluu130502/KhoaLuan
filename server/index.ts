import express, { Express, Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
app.use(express.json());

// Morgan
import morgan from "morgan";
var env: string = process.env.NODE_ENV || "development";
if (env !== "production") {
  app.use(morgan("combined"));
}

// CORS
import cors from "cors";
app.use(
  cors({
    origin: [process.env.CLIENT_URL || ""], // Provide a default value when process.env.CLIENT_URL is undefined
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

// Connect to MongoDB
import connectDatabase from "./configs/connectDatabase";
connectDatabase();

// Body Parser
import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
import userRoutes from "./routes/userRoutes";
app.use("/user", userRoutes);

import ncgRoutes from "./routes/ncgRoutes";
app.use("/ncg", ncgRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Serve static files
app.use("/public", express.static("public"));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// 404 Error Handler
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});

// Error handling middleware
app.use(function (err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("Server response: " + err.message);
  res.status(500).send("Server response: " + err.message);
});