import { login, register } from "../controllers/authControllers.js";
import { verifyEmail } from "../controllers/verifyController.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);

export default router;
