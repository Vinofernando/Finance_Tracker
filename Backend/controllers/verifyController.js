import pool from "../config/db.js";

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const result = await pool.query(
      `SELECT verified_token FROM users WHERE verified_token = $1`,
      [token],
    );

    if (result.rows.length === 0)
      throw { status: 400, message: "Token tidak valid" };

    await pool.query(
      `UPDATE users SET is_verified = true, verified_token = null WHERE verified_token = $1`,
      [token],
    );
    res.json({ message: `Akun berhasil di verifikasi, silahkan login` });
  } catch (err) {
    next(err);
  }
};
