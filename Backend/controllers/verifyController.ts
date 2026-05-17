import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerification } from "../utils/mailService.js";
// 1. Import tipe resmi dari express
import type { RequestHandler } from "express";

// 2. Pasang tipe RequestHandler pada variabel fungsi, BUKAN di dalam parameter
export const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
    // Sekarang req, res, dan next otomatis bertipe Request, Response, dan NextFunction secara ajaib!
    const token = req.query.token as string;
    if (!token) {
      res
        .status(400)
        .json({ message: "Token query parameter tidak ditemukan" });
      return;
    }

    const result = await pool.query(
      `SELECT user_email, token_expires_at FROM users WHERE verified_token = $1`,
      [token],
    );

    if (!result.rows || result.rows.length === 0) {
      res
        .status(400)
        .json({ message: "Token tidak valid atau tidak ditemukan" });
      return;
    }

    const expiredToken = result.rows[0].token_expires_at;
    const email = result.rows[0].user_email;

    if (expiredToken < new Date()) {
      const newToken = uuidv4();
      const newExpiredDate = new Date();
      newExpiredDate.setMinutes(newExpiredDate.getMinutes() + 15);

      await pool.query(
        `UPDATE users SET verified_token = $1, token_expires_at = $2 WHERE verified_token = $3`,
        [newToken, newExpiredDate, token],
      );

      await sendVerification(email, newToken);

      res.status(400).json({
        message:
          "Token expired, we already sent a new email verification link.",
      });
      return;
    }

    await pool.query(
      `UPDATE users SET is_verified = true, verified_token = null, token_expires_at = null WHERE verified_token = $1`,
      [token],
    );

    res.json({ message: "Akun berhasil di verifikasi, silahkan login" });
  } catch (err) {
    next(err);
  }
};
