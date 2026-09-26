// Imports

import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import connectDB from "./db/connect.mongooseAtlas.js";
import userRouter from "./routes/user.route.js";
import scoreRouter from "./routes/score.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// routes

app.use("/user", userRouter);
app.use("/score", scoreRouter);

// Server running

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
});
