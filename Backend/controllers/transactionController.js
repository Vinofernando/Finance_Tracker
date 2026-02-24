import * as transactionService from "../services/transactionsService.js";

export const getUserTransaction = async (req, res, next) => {
  console.log(req.user.userId);
  try {
    const userTransactions = await transactionService.getUserTransaction(
      req.user.userId,
    );
    res.json(userTransactions);
  } catch (err) {
    next(err);
  }
};

export const newTransaction = async (req, res, next) => {
  console.log(req.user.userId);
  console.log(req.body);
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

export const deleteTransaction = async (req, res, next) => {
  console.log(req.user.userId);
  console.log(req.params);
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

export const sumTransactions = async (req, res, next) => {
  console.log(req.user.userId);
  try {
    const sumTransactions = await transactionService.sumTransactions(
      req.user.userId,
    );
    res.json(sumTransactions);
  } catch (err) {
    next(err);
  }
};
