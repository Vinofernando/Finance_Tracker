import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendVerification } from "../utils/mailService.js";

const SECRET_KEY = process.env.SECRET_KEY;

export const register = async ({ username, email, password }) => {
  if (!username || !email || !password)
    throw { status: 400, message: "All field must filled" };

  const existedEmail = await pool.query(
    `
        SELECT user_email FROM users WHERE user_email = $1
    `,
    [email],
  );

  if (existedEmail.rows.length > 0) {
    return { status: 400, message: "Email already registered" };
  }

  const verifiedToken = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `
        INSERT INTO users(username, user_email, user_password, verified_token)
        VALUES ($1, $2, $3, $4)
        RETURNING username, user_email
    `,
    [username, email, hashedPassword, verifiedToken],
  );

  sendVerification(email, verifiedToken);
  return {
    message: "Registered successfully pleas check ur email for verification",
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password)
    throw { status: 400, message: "Email or password must filled" };

  const existedEmail = await pool.query(
    `SELECT * FROM users WHERE user_email = $1`,
    [email],
  );

  if (existedEmail.rows.length === 0)
    throw { status: 400, message: "Email not found" };

  const getUser = await pool.query(
    `SELECT * FROM users WHERE user_email = $1`,
    [email],
  );

  const user = getUser.rows[0];
  const comparePassword = await bcrypt.compare(password, user.user_password);

  if (!user.is_verified)
    throw { status: 400, message: "Email has not been verified" };

  if (!comparePassword)
    throw { status: 400, message: "Email or password wrong " };

  const payload = {
    username: user.username,
    email: user.user_email,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  return {
    ...payload,
    token,
  };
};
