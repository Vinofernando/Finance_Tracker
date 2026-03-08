import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerification } from "../utils/mailService.js";

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const result = await pool.query(
      `SELECT user_email, token_expires_at FROM users WHERE verified_token = $1`,
      [token],
    );

    const expiredToken = result.rows[0].token_expires_at;
    const email = result.rows[0].user_email;
    if (result.rows.length === 0)
      throw { status: 400, message: "Token tidak valid" };

    if (expiredToken < new Date()) {
      const newToken = uuidv4();
      const newExpiredDate = new Date();
      newExpiredDate.setMinutes(newExpiredDate.getMinutes() + 15);
      await pool.query(
        ` UPDATE users SET verified_token = $1, token_expires_at = $2 WHERE verified_token = $3`,
        [newToken, newExpiredDate, token],
      );

      await sendVerification(email, newToken);
      throw {
        status: 400,
        message: "Token expired we already send a new email verification",
      };
    }

    await pool.query(
      `UPDATE users SET is_verified = true, verified_token = null, token_expires_at = null WHERE verified_token = $1`,
      [token],
    );
    res.json({ message: `Akun berhasil di verifikasi, silahkan login` });
  } catch (err) {
    next(err);
  }
};
