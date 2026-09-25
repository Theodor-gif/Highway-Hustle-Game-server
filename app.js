// Imports

import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import connectDB from "./db/connect.mongooseAtlas.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Midlewares

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Server running

connectDB().then(
  app.listen(PORT, () =>
    console.log(`Server is running on ${process.env.PORT}`),
  ),
);
