import {
  getUserTransaction,
  newTransaction,
  deleteTransaction,
  sumTransactions,
} from "../controllers/transactionController.js";
import { authenticatedToken } from "../middleware/authenticatedToken.js";
import express from "express";

const router = express.Router();

router.get("/", authenticatedToken, getUserTransaction);
router.post("/add-transaction", authenticatedToken, newTransaction);
router.delete("/delete-transaction/:id", authenticatedToken, deleteTransaction);
router.get("/summary", authenticatedToken, sumTransactions);

export default router;
