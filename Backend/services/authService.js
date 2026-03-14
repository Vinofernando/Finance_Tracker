import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendVerification } from "../utils/mailService.js";

const SECRET_KEY = process.env.SECRET_KEY;

export const register = async ({ username, email, password }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (!username || !email || !password) throw new Error("All_field_required");

    const existedEmail = await client.query(
      `
        SELECT user_email FROM users WHERE user_email = $1
    `,
      [email],
    );

    if (existedEmail.rows.length > 0) {
      throw new Error("Email_already_registered");
    }

    const verifiedToken = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await client.query(
      `
        INSERT INTO users(username, user_email, user_password, verified_token, token_expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING username, user_email
    `,
      [username, email, hashedPassword, verifiedToken, expiresAt],
    );

    await sendVerification(email, verifiedToken);
    return {
      message: "Registered successfully pleas check ur email for verification",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.message === "Email_already_registered") {
      throw { status: 400, message: "Email already registered" };
    } else if (error.message === "All_field_required") {
      throw { status: 400, message: "All field required" };
    } else {
      throw { status: 500, message: "Internal server error" };
    }
  } finally {
    client.release();
  }
};

export const login = async ({ email, password }) => {
  if (!email || !password)
    throw { status: 400, message: "Email or password must filled" };

  const getUser = await pool.query(
    `SELECT * FROM users WHERE user_email = $1`,
    [email],
  );

  if (getUser.rows.length === 0)
    throw { status: 400, message: "Email not found" };

  const user = getUser.rows[0];
  const comparePassword = await bcrypt.compare(password, user.user_password);

  if (!user.is_verified)
    throw { status: 400, message: "Email has not been verified" };

  if (!comparePassword)
    throw { status: 400, message: "Email or password wrong " };

  const payload = {
    userId: user.user_id,
    username: user.username,
    email: user.user_email,
    role: user.role,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  return {
    message: "Login successfully",
    token,
    ...payload,
  };
};

export const deleteUser = async (userId, role) => {
  if (!userId) throw { status: 400, message: "UserId undefined" };

  const result = await pool.query(
    `DELETE FROM users WHERE user_id = $1 RETURNING *`,
    [userId],
  );

  if (result.rowCount === 0) throw { status: 400, message: "User not found" };
  if (result.rows[0].role === "admin")
    throw { status: 400, message: "Tidak bisa menghapus role admin" };

  return {
    message: "Delete user successfully",
    result: result.rows[0],
  };
};
