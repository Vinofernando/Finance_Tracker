import express from "express";

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface Payload {
  userId: number;
  username: string;
  email: string;
  password: string;
}

// SERVICES
export interface NewTransaction {
  userId: number;
  amount: number;
  type: string;
  categoryId: number;
  description: string;
}

export interface ReqResNext {
  req: express.Request;
  res: express.Response;
  next: express.NextFunction;
}

export interface SumDataTransactions {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
// TRANSACTION CONTROLLER
export interface GetUserTransactionControl {
  user: {
    userId: number;
    username: string;
    email: string;
    password: string;
  };
  query: {
    start: string;
    end: string;
    order?: string;
  };
}

export interface NewTransactionControl {
  user: {
    userId: number;
  };
  body: {
    amount: number;
    type: string;
    categoryId: number;
    description: string;
  };
}

export interface deleteTransactionControl {
  user: {
    userId: number;
  };
  params: {
    id: number;
  };
}

export interface SumTransactionsControl {
  user: {
    userId: number;
  };
}

export interface GetUserControl {
  query: {
    userId: number;
  };
}

// AUTH CONTROLLER

export interface RegisterControl {
  body: {
    username: string;
    email: string;
    password: string;
  };
}
export interface LoginControl {
  body: {
    email: string;
    password: string;
  };
}
export interface DeleteUserControl {
  params: {
    userId: number;
  };
  user: {
    role: string;
  };
}
export interface ForgotPasswordControl {
  body: {
    email: string;
  };
}
export interface ResetPasswordControl {
  body: {
    newPassword: string;
  };
  query: {
    token: string;
  };
}
