import express from "express";
import * as transactionService from "../services/transactionsService.js";
import type { Request } from "express";
import type {
  GetUserControl,
  GetUserTransactionControl,
  NewTransactionControl,
  DeleteTransactionControl,
} from "../interfaces/interfaces.js";
export const getUserTransaction = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { start, end, order } =
      req.query as unknown as GetUserTransactionControl;
    const userTransactions = await transactionService.getUserTransaction(
      Number(req.user.userId),
      start,
      end,
      order,
    );
    res.json(userTransactions);
  } catch (err) {
    next(err);
  }
};

export const newTransaction = async (
  req: Request<{}, {}, NewTransactionControl>,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addTransactions = await transactionService.newTransaction({
      userId: req.user.userId,
      amount: req.body.amount,
      type: req.body.type,
      categoryId: req.body.categoryId,
      description: req.body.description,
    });
    res.json(addTransactions);
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params as unknown as DeleteTransactionControl;
    const deleteTransaction = await transactionService.deleteTransaction(
      req.user.userId,
      id,
    );
    res.json(deleteTransaction);
  } catch (err) {
    next(err);
  }
};

export const sumTransactions = async (
  req: Request<{}>,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const sumTransactions = await transactionService.sumTransactions(
      req.user.userId,
    );
    res.json(sumTransactions);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { userId } = req.query as unknown as GetUserControl;
    const user = await transactionService.getUser(userId);
    res.json(user);
  } catch (err) {
    return next(err);
  }
};
