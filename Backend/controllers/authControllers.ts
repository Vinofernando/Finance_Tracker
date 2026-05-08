import type {
  DeleteUserControl,
  ForgotPasswordControl,
  LoginControl,
  RegisterControl,
  ResetPasswordControl,
} from "../interfaces/interfaces.js";
import * as authService from "../services/authService.js";
import express from "express";

export const register = async (
  req: RegisterControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const result = await authService.register({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.json(result);
  } catch (err) {
    console.log("--- ERROR REGISTER ---");
    console.error(err); // Ini akan muncul di log Railway kamu
    console.log("-----------------------");
    return next(err);
  }
};

export const login = async (
  req: LoginControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (
  req: DeleteUserControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const deleteResult = await authService.deleteUser(
      req.params.userId,
      req.user.role,
    );
    res.json(deleteResult);
  } catch (err) {
    return next(err);
  }
};

export const forgotPassword = async (
  req: ForgotPasswordControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const forgotResult = await authService.forgotPassword(req.body.email);
    res.json(forgotResult);
  } catch (err) {
    return next(err);
  }
};

export const resetPassword = async (
  req: ResetPasswordControl,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const resetPassResult = await authService.resetPassword(
      req.body.newPassword,
      req.query.token,
    );
    res.json(resetPassResult);
  } catch (err) {
    return next(err);
  }
};
