import pool from "../config/db.js";

export default async function processPlannedTransactions() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const pendingTransactions = await pool.query(
      `SELECT * FROM planned_transactions WHERE start_date <= $1 AND is_active = $2`,
      [today, true],
    );

    for (const plan of pendingTransactions.rows) {
      await pool.query(
        `INSERT INTO transactions(user_id, amount, type, category_id, description, date) VALUES($1, $2, $3, $4, $5, $6)`,
        [
          plan.user_id,
          plan.amount,
          plan.type,
          plan.category_id,
          plan.description,
          plan.start_date,
        ],
      );

      let nextDate = new Date(plan.start_date);
      if (plan.frequency === "yearly")
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      if (plan.frequency === "monthly")
        nextDate.setMonth(nextDate.getMonth() + 1);
      if (plan.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
      if (plan.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);

      await pool.query(
        `UPDATE planned_transactions SET start_date = $1 WHERE planned_id = $2`,
        [nextDate.toISOString().split("T")[0], plan.planned_id],
      );
    }
    console.log(
      `[Cron Job] Berhasil memproses ${pendingTransactions.rowCount} transaksi otomatis.`,
    );
  } catch (err) {
    console.error("Gagal memproses transaksi otomatis:", err);
  }
}
