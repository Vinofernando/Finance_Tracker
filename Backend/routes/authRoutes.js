import { login, register, deleteUser } from "../controllers/authControllers.js";
import { verifyEmail } from "../controllers/verifyController.js";
import authorizeRole from "../utils/authorizeRole.js";
import { authenticatedToken } from "../middleware/authenticatedToken.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.get("/verify", verifyEmail);
router.post("/login", login);
router.delete(
  "/delete/:userId",
  authenticatedToken,
  authorizeRole("admin"),
  deleteUser,
);

export default router;
