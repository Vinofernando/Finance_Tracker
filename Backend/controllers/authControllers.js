import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.json(result);
  } catch (error) {
    console.log("--- ERROR REGISTER ---");
    console.error(error); // Ini akan muncul di log Railway kamu
    console.log("-----------------------");

    res.status(500).json({
      error: true,
      message: error.message,
      dev_msg: error.stack, // Tambahkan ini sementara agar bisa lihat error di Postman
    });
  }
};

export const login = async (req, res, next) => {
  console.log(req.body);
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (req, res, next) => {
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

export const forgotPassword = async (req, res, next) => {
  try {
    const forgotResult = await authService.forgotPassword(req.body.email);
    res.json(forgotResult);
  } catch (err) {
    return next(err);
  }
};

export const resetPassword = async (req, res, next) => {
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
