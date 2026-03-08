import {
  getUserTransaction,
  newTransaction,
  deleteTransaction,
  sumTransactions,
  getUser,
} from "../controllers/transactionController.js";
import { authenticatedToken } from "../middleware/authenticatedToken.js";
import authorizeRole from "../utils/authorizeRole.js";
import express from "express";

const router = express.Router();

router.get(`/`, authenticatedToken, getUserTransaction);
router.post("/add-transaction", authenticatedToken, newTransaction);
router.delete("/delete-transaction/:id", authenticatedToken, deleteTransaction);
router.get("/summary", authenticatedToken, sumTransactions);
router.get("/users", authenticatedToken, authorizeRole("admin"), getUser);

export default router;
