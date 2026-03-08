import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  console.log(req.body);
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (err) {
    return next(err);
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
