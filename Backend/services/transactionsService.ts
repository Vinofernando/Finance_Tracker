import pool from "../config/db.js";
import redisClient, { connectRedis } from "../config/redis.js";
import type {
  NewTransaction,
  SumDataTransactions,
  PlannedTransaction,
} from "../interfaces/interfaces.js";

// Fungsi pembantu internal untuk memastikan koneksi Redis aman
const menjaminRedisTerbuka = async () => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
    return true;
  } catch (err) {
    console.error("Gagal menyambungkan ulang ke Redis:", err);
    return false;
  }
};

export const getUserTransaction = async (
  userId: number,
  start = "",
  end = "",
  order?: string,
) => {
  const cacheKey = `Transaction:${userId}:${start}:${end}:${order || "NONE"}`;

  try {
    if (await menjaminRedisTerbuka()) {
      const cacheData = await redisClient.get(cacheKey);
      if (cacheData) return JSON.parse(cacheData);
    }
  } catch (err) {
    console.error("Redis error, bypassing to Database:", err);
  }

  // Validasi tanggal ditaruh sebelum query berjalan demi efisiensi
  if ((end && !start) || start > end) {
    throw {
      status: 400,
      message: "Tanggal akhir tidak boleh lebih kecil dari awal",
    };
  }

  const value = [userId];
  let query = `SELECT 
      t.transaction_id, t.user_id, t.amount, t.type, t.date, t.description, c.category
    FROM categories c
    INNER JOIN transactions t on t.category_id = c.categories_id
    WHERE user_id = $1 `;

  if (start || end) {
    query += ` AND (date AT TIME ZONE 'Asia/Jakarta')::date between '${start}' AND '${end}'`;
  }

  if (order) {
    query += ` ORDER BY date ${order}`;
  }

  const result = await pool.query(query, value);

  try {
    if (redisClient.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(result.rows), {
        EX: 3600,
      });
    }
  } catch (err) {
    console.error("Gagal menyimpan ke Redis:", err);
  }
  return result.rows;
};

export const newTransaction = async ({
  userId,
  amount,
  type,
  categoryId,
  description,
}: NewTransaction) => {
  if (!amount || !type || !categoryId || !description || amount <= 0)
    throw {
      status: 400,
      message: "All field required and Amount cannot equal or less than zero",
    };

  // Bersihkan semua cache terkait user ini karena data berubah
  try {
    if (await menjaminRedisTerbuka()) {
      const keys = await redisClient.keys(`Transaction:${userId}:*`);
      if (keys.length > 0) await redisClient.del(keys);
      await redisClient.del(`Transactions: ${userId}`); // Perbaikan Bug 2: Hapus cache summary
    }
  } catch (err) {
    console.error("Gagal membersihkan cache saat data baru masuk:", err);
  }

  let finalAmount = Number(amount);
  finalAmount =
    type.toLowerCase() === "expense"
      ? Math.abs(finalAmount) * -1
      : Math.abs(finalAmount);

  const result = await pool.query(
    `INSERT INTO transactions(user_id, amount, type, category_id, description)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, finalAmount, type, categoryId, description],
  );

  return {
    message: "Successfully add new transaction",
    data: result.rows[0],
  };
};

export const deleteTransaction = async (
  userId: number,
  transactionId: number,
) => {
  // Bersihkan semua cache terkait user ini karena data dihapus
  try {
    if (await menjaminRedisTerbuka()) {
      // Perbaikan Bug 1 & 2: Gunakan wildcard :* dan ikut hapus cache summary
      const keys = await redisClient.keys(`Transaction:${userId}:*`);
      if (keys.length > 0) await redisClient.del(keys);
      await redisClient.del(`Transactions: ${userId}`);
    }
  } catch (err) {
    console.error("Gagal membersihkan cache saat data dihapus:", err);
  }

  const transaction = await pool.query(
    `DELETE FROM transactions WHERE transaction_id = $1 AND user_id = $2 RETURNING *`,
    [transactionId, userId],
  );

  if (transaction.rows.length === 0)
    throw { status: 400, message: "Transaction not found" };

  return {
    message: "Delete successfully",
    data: transaction.rows[0],
  };
};

export const sumTransactions = async (userId: number) => {
  const cacheKey2 = `Transactions: ${userId}`;

  try {
    if (await menjaminRedisTerbuka()) {
      const cacheData2 = await redisClient.get(cacheKey2);
      if (cacheData2) return { data: JSON.parse(cacheData2) };
    }
  } catch (err) {
    console.error("Redis error pada summary:", err);
  }

  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth(); // 0 = Jan, 1 = Feb, dst.

  const sumDataTransactions: SumDataTransactions[] = [
    { month: "Jan", income: 0, expense: 0, balance: 0 },
    { month: "Feb", income: 0, expense: 0, balance: 0 },
    { month: "Mar", income: 0, expense: 0, balance: 0 },
    { month: "Apr", income: 0, expense: 0, balance: 0 },
    { month: "May", income: 0, expense: 0, balance: 0 },
    { month: "June", income: 0, expense: 0, balance: 0 },
    { month: "July", income: 0, expense: 0, balance: 0 },
    { month: "Aug", income: 0, expense: 0, balance: 0 },
    { month: "Sept", income: 0, expense: 0, balance: 0 },
    { month: "Oct", income: 0, expense: 0, balance: 0 },
    { month: "Nov", income: 0, expense: 0, balance: 0 },
    { month: "Dec", income: 0, expense: 0, balance: 0 },
  ];

  // Perbaikan Bug 3: Ganti 24x query loop menjadi HANYA 1x KALI QUERY OPTIMAL saja!
  const dbResult = await pool.query(
    `SELECT 
        EXTRACT(MONTH FROM date) as bulan,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
     FROM transactions
     WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2
     GROUP BY EXTRACT(MONTH FROM date)`,
    [userId, thisYear],
  );

  // Masukkan hasil dari database 1-kali-tarik tersebut ke dalam array struktur bulan
  dbResult.rows.forEach((row) => {
    const indexBulan = Number(row.bulan) - 1; // SQL Bulan dimulai dari 1, JS dari 0
    if (indexBulan <= thisMonth && sumDataTransactions[indexBulan]) {
      const inc = Number(row.total_income || 0);
      const exp = Number(row.total_expense || 0);

      sumDataTransactions[indexBulan].income = Math.trunc(inc);
      sumDataTransactions[indexBulan].expense = Math.trunc(exp);
      sumDataTransactions[indexBulan].balance = Math.trunc(inc + exp); // karena expense sudah bernilai negatif di DB
    }
  });

  try {
    if (redisClient.isOpen) {
      await redisClient.set(cacheKey2, JSON.stringify(sumDataTransactions), {
        EX: 3600,
      });
    }
  } catch (err) {
    console.error("Gagal menyimpan ke Redis:", err);
  }

  return { data: sumDataTransactions };
};

export const getUser = async (userId: number) => {
  const query = `
  SELECT 
    u.user_id, u.username, u.user_email, u.role, 
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
    SUM(t.amount) as total_amount
  FROM transactions t 
  LEFT JOIN users u ON t.user_id = u.user_id 
  WHERE u.role != $1`;

  const groupByClause = ` GROUP BY u.user_id, u.username, u.user_email, u.role`;

  if (userId !== null) {
    const condition = `${query} AND u.user_id = $2 ${groupByClause}`;
    const res = await pool.query(condition, ["admin", userId]);
    return res.rows;
  }

  const res = await pool.query(query + groupByClause, ["admin"]);
  return { user: res.rows };
};

export const plannedTransaction = async ({
  userId,
  categoryId,
  amount,
  description,
  type,
  startDate,
  frequency,
}: PlannedTransaction) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO planned_transactions(user_id, category_id, amount, description, type, start_date, frequency) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `,
      [userId, categoryId, amount, description, type, startDate, frequency],
    );

    return {
      message: "Add new planned transaction successfully",
      data: result.rows,
    };
  } catch (err) {
    console.error("Gagal menambah transaksi tetap", err);
    return;
  }
};

export const getUserPlannedTransaction = async (
  userId: number,
  plannedId: string | "",
) => {
  try {
    if (!plannedId) {
      const userPlanTran = await pool.query(
        `SELECT * FROM planned_transactions WHERE user_id = $1 ORDER BY planned_id ASC`,
        [userId],
      );
      return {
        message: "Berhasil mendapat data user",
        data: userPlanTran.rows,
      };
    }

    const userByPlanId = await pool.query(
      `SELECT * FROM planned_transactions WHERE user_id = $1 AND planned_id = $2 ORDER BY planned_id ASC`,
      [userId, plannedId],
    );
    return {
      message: "Berhasil mendapat data user",
      data: userByPlanId.rows,
    };
  } catch (err) {
    console.error("Gagal mendapat transaksi tetap", err);
    return;
  }
};

export const updatePlannedTransactionActive = async (
  userId: number,
  isActive: boolean,
  plannedTransactionId: number,
) => {
  try {
    const result = await pool.query(
      `UPDATE planned_transactions SET is_active = $1 WHERE user_id = $2 AND planned_id = $3 RETURNING is_active, user_id, planned_id`,
      [isActive, userId, plannedTransactionId],
    );

    if (result.rowCount === 0) {
      console.error({ message: "Cant find planned transaction" });
      return;
    }

    return {
      message: "Update successfuly",
      data: result.rows[0],
    };
  } catch (err) {
    console.error("Gagal update transaksi", err);
    throw err;
  }
};

export const updatePlannedTransaction = async (
  userId: number,
  categoryId: number,
  amount: number,
  description: string,
  type: string,
  startDate: string,
  frequency: string,
  plannedId: string,
) => {
  try {
    const result = await pool.query(
      `UPDATE planned_transactions SET category_id = COALESCE($1, category_id), amount = COALESCE($2, amount), description = COALESCE($3, description), type = COALESCE($4, type), start_date = COALESCE($5, start_date), frequency = COALESCE($6, frequency) WHERE user_id = $7 AND planned_id = $8 RETURNING *`,
      [
        categoryId ?? null,
        amount ?? null,
        description ?? null,
        type ?? null,
        startDate ?? null,
        frequency ?? null,
        userId,
        plannedId,
      ],
    );

    if (result.rowCount === 0) {
      console.error({ message: "Cant find planned transaction" });
      return;
    }

    return {
      message: "Berhasil update data transaksi tetap",
      data: result.rows,
    };
  } catch (err) {
    console.error("Gagal update transaksi tetap", err);
    throw err;
  }
};

export const deletePlannedTransaction = async (
  userId: number,
  plannedId: string,
) => {
  try {
    const result = await pool.query(
      `DELETE FROM planned_transactions WHERE user_id = $1 AND planned_id = $2 RETURNING *`,
      [userId, plannedId],
    );

    if (result.rowCount === 0 || null) {
      throw { status: 400, message: "Transaction not found" };
    }

    return {
      message: "Successfully deleted planned transaction",
      data: result.rows,
    };
  } catch (err) {
    throw err;
  }
};
