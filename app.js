import express from "express";
import { config } from "dotenv";
import colors from "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import ErrorMiddleware from "./middleware/ErrorMiddleware.js";
config({
  path: "./config/config.env",
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// All Routes Import
import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";
import payment from "./routes/paymentRoutes.js";
import other from "./routes/otherRoutes.js";

// All Routes prefix
app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);

export default app;

app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. Click <a href=${process.env.FRONTEND_URL} > here </a> to visit frontend </h1>`
  )
);

app.use(ErrorMiddleware);
