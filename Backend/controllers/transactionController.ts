import express from "express";
import * as transactionService from "../services/transactionsService.js";
import type { NextFunction, Request } from "express";
import type {
  GetUserControl,
  GetUserTransactionControl,
  NewTransactionControl,
  DeleteTransactionControl,
} from "../interfaces/interfaces.js";
import predictCatTyp from "../utils/predictCatTyp.js";

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
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(req.user.userId);
    if (!userId) {
      return res.status(401).json({ message: "Cant find user" });
    }
    const sumTransactions = await transactionService.sumTransactions(userId);
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

export const predict = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { description } = req.body;

    const resultPred = await predictCatTyp(description);
    res.json(resultPred);
  } catch (err) {
    return next(err);
  }
};

export const planningTransaction = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const resultPlannedTransaction =
      await transactionService.plannedTransaction({
        userId: Number(req.user.userId),
        categoryId: Number(req.body.categoryId),
        amount: Number(req.body.amount),
        description: req.body.description,
        type: req.body.type,
        startDate: req.body.startDate,
        frequency: req.body.frequency,
      });

    res.status(201).json(resultPlannedTransaction);
  } catch (err) {
    return next(err);
  }
};

export const userPlanedtransaction = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { plannedId } = req.query as { plannedId: string | "" };
    const result = await transactionService.getUserPlannedTransaction(
      req.user.userId,
      plannedId,
    );

    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

export const updatePlannedTransactionActive = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await transactionService.updatePlannedTransactionActive(
      req.user.userId,
      req.body.isActive,
      req.body.plannedTransactionId,
    );

    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

export const updatePlannedTransaction = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json("Unauthorized");
    }

    const { plannedId } = req.query as { plannedId: string };
    const result = await transactionService.updatePlannedTransaction(
      req.user.userId,
      req.body.categoryId,
      req.body.amount,
      req.body.description,
      req.body.type,
      req.body.startDate,
      req.body.frequency,
      plannedId,
    );

    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

export const deleteControl = async (
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json("Unauthorized");
    }

    const { plannedId } = req.query as { plannedId: string };

    const result = await transactionService.deletePlannedTransaction(
      req.user.userId,
      plannedId,
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
