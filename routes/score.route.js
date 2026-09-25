import express from "express";
import { getScores, addScore } from "../controllers/scoreController.js";
import isAuth from "../middleware/isAuth.js";

const route = express.Router();

route.use("/scores", getScores);
route.use("/add", isAuth, addScore);

export default route;
