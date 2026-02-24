import {
  getUserTransaction,
  newTransaction,
} from "../controllers/transactionController.js";
import { authenticatedToken } from "../middleware/authenticatedToken.js";
import express from "express";

const router = express.Router();

router.get("/", authenticatedToken, getUserTransaction);
router.post("/add-transaction", authenticatedToken, newTransaction);

export default router;
