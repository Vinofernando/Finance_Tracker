import express from "express";
import * as transactionService from "../services/transactionsService.js";
import type {
  GetUserControl,
  GetUserTransactionControl,
  NewTransactionControl,
  SumTransactionsControl,
  deleteTransactionControl,
} from "../interfaces/interfaces.js";
export const getUserTransaction = async (
  req: GetUserTransactionControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userTransactions = await transactionService.getUserTransaction(
      Number(req.user.userId),
      req.query.start,
      req.query.end,
      req.query.order,
    );
    res.json(userTransactions);
  } catch (err) {
    next(err);
  }
};

export const newTransaction = async (
  req: NewTransactionControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
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
  req: deleteTransactionControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const deleteTransaction = await transactionService.deleteTransaction(
      req.user.userId,
      req.params.id,
    );
    res.json(deleteTransaction);
  } catch (err) {
    next(err);
  }
};

export const sumTransactions = async (
  req: SumTransactionsControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sumTransactions = await transactionService.sumTransactions(
      req.user.userId,
    );
    res.json(sumTransactions);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: GetUserControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const user = await transactionService.getUser(req.query.userId);
    res.json(user);
  } catch (err) {
    return next(err);
  }
};
