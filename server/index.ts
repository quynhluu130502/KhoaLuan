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

// Cookie Parser
import cookieParser from "cookie-parser";
app.use(cookieParser());

// Connect to MongoDB
import connectDatabase from "./configs/connectDatabase";
connectDatabase();

// Body Parser
import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
import userRoutes from "./routes/userRoute";
app.use("/user", userRoutes);

import ncgRoutes from "./routes/ncgRoute";
app.use("/ncg", ncgRoutes);

import qsaRoutes from "./routes/qsaRoute";
app.use("/qsa", qsaRoutes);

import authRoutes from "./routes/authRoute";
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Check if the public folder exists, if not, create it
if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}

// Serve static files
app.use("/public", express.static("public"));

// Start the server
import https from "https";
import fs from "fs";
import path from "path";

const port = process.env.PORT || 3000;
if (env === "production") {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
} else {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, `localhost+1-key.pem`), "utf-8"),
    cert: fs.readFileSync(path.resolve(__dirname, `localhost+1.pem`), "utf-8"),
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
}

// 404 Error Handler
import createError from "http-errors";
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    // next(new Error("Something went wrong"));
    next(createError(404));
  });
});

// Error handling middleware
app.use(function (err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.log(err.stack);
  console.error("Server response: " + err.message);
  res.status(500).send("Server response: " + err.message);
});

// console.log(require('crypto').randomBytes(64).toString('hex'));
