import { register, getUsers, logIn } from "../controllers/userController.js";
import express from "express";

const route = express.Router();

route.use("/register", register);
route.use("/users", getUsers);
route.use("/log", logIn);

export default route;
