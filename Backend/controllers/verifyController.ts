import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerification } from "../utils/mailService.js";
import type { ReqResNext } from "../interfaces/interfaces.js";

export const verifyEmail = async ({ req, res, next }: ReqResNext) => {
  try {
    const { token } = req.query;

    // 1. Proteksi Ekstra: Jika pool terimbas circular dependency, coba import ulang atau lempar error yang jelas
    if (!pool) {
      throw {
        status: 500,
        message:
          "Database connection instance (pool) is undefined. Check for circular dependencies in config.",
      };
    }

    const result = await pool.query(
      `SELECT user_email, token_expires_at FROM users WHERE verified_token = $1`,
      [token],
    );

    // 2. PERBAIKAN BUG: Cek ketersediaan data TERLEBIH DAHULU sebelum melakukan destructuring (.rows[0])
    if (!result.rows || result.rows.length === 0) {
      throw { status: 400, message: "Token tidak valid atau tidak ditemukan" };
    }

    // Sekarang aman membaca properti karena kita tahu pasti datanya eksis
    const expiredToken = result.rows[0].token_expires_at;
    const email = result.rows[0].user_email;

    // 3. Validasi Kedaluwarsa Token
    if (expiredToken < new Date()) {
      const newToken = uuidv4();
      const newExpiredDate = new Date();
      newExpiredDate.setMinutes(newExpiredDate.getMinutes() + 15);

      await pool.query(
        `UPDATE users SET verified_token = $1, token_expires_at = $2 WHERE verified_token = $3`,
        [newToken, newExpiredDate, token],
      );

      await sendVerification(email, newToken);

      throw {
        status: 400,
        message:
          "Token expired, we already sent a new email verification link.",
      };
    }

    // 4. Jika lolos semua validasi, verifikasi sukses!
    await pool.query(
      `UPDATE users SET is_verified = true, verified_token = null, token_expires_at = null WHERE verified_token = $1`,
      [token],
    );

    return res.json({ message: "Akun berhasil di verifikasi, silahkan login" });
  } catch (err) {
    next(err);
  }
};
