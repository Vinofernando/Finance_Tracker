import {
  getUserTransaction,
  newTransaction,
  deleteTransaction,
  sumTransactions,
  getUser,
  planningTransaction,
  userPlanedtransaction,
  updatePlannedTransactionActive,
  updatePlannedTransaction,
  deleteControl,
} from "../controllers/transactionController.js";
import { authenticatedToken } from "../middleware/authenticatedToken.js";
import authorizeRole from "../utils/authorizeRole.js";
import { predict } from "../controllers/transactionController.js";
import express from "express";

const router = express.Router();

router.get(`/`, authenticatedToken, getUserTransaction);
router.post("/add-transaction", authenticatedToken, newTransaction);
router.delete("/delete-transaction/:id", authenticatedToken, deleteTransaction);
router.get("/summary", authenticatedToken, sumTransactions);
router.get("/users", authenticatedToken, authorizeRole("admin"), getUser);
router.post("/predict", authenticatedToken, predict);
router.post("/planned-transaction", authenticatedToken, planningTransaction);
router.get("/planned-transaction", authenticatedToken, userPlanedtransaction);
router.put(
  "/update-planned-transaction-active",
  authenticatedToken,
  updatePlannedTransactionActive,
);
router.put(
  "/update-planned-transaction",
  authenticatedToken,
  updatePlannedTransaction,
);
router.delete("/delete-planned-transaction", authenticatedToken, deleteControl);
export default router;
