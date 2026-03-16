import pool from "../config/db.js";

export const getUserTransaction = async (
  userId,
  start = "",
  end = "",
  order = null,
) => {
  const value = [userId];
  let query = `SELECT 
      t.transaction_id,
      t.user_id,
      t.amount,
      t.type,
      t.date,
      t.description,
      c.category

    FROM categories c
    INNER JOIN transactions t on t.category_id = c.categories_id
    WHERE user_id = $1
    `;

  if ((end && !start) || start > end) {
    throw {
      status: 400,
      message: "Tanggal akhir tidak boleh lebih kecil dari awal",
    };
  }
  if (start || end) {
    query += ` AND (date AT TIME ZONE 'Asia/Jakarta')::date between '${start}' AND '${end}'`;
  }

  if (order !== null) {
    query += ` ORDER BY date ${order}`;
  }

  const result = await pool.query(query, value);
  console.log(query);
  return result.rows;
};

export const newTransaction = async ({
  userId,
  amount,
  type,
  categoryId,
  description,
}) => {
  if (!amount || !type || !categoryId || !description)
    throw { status: 400, message: "All field required" };

  if (amount <= 0)
    throw { status: 400, message: "Amount cannot equal or less than zero" };
  let finalAmount = Number(amount);

  if (type.toLowerCase() === "expense") {
    finalAmount = Math.abs(finalAmount) * -1;
  } else {
    finalAmount = Math.abs(finalAmount);
  }

  const result = await pool.query(
    `
      INSERT INTO transactions(user_id, amount, type, category_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [userId, finalAmount, type, categoryId, description],
  );

  return {
    message: "Successfully add new transaction",
    data: result.rows[0], // Biasanya lebih baik return satu objek saja
  };
};

export const deleteTransaction = async (userId, transactionId) => {
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

export const sumTransactions = async (userId) => {
  const getIncome = await pool.query(
    `
      SELECT SUM (amount)
      FROM transactions
      WHERE user_id = $1
      AND type = $2
    `,
    [userId, "income"],
  );

  const getExpense = await pool.query(
    `
      SELECT SUM (amount)
      FROM transactions
      WHERE user_id = $1
      AND type = $2
    `,
    [userId, "expense"],
  );

  const income = getIncome.rows[0].sum;
  const expense = getExpense.rows[0].sum;
  const balance = income - -expense;

  return {
    income: Number(income),
    expense: Number(expense),
    balance,
  };
};

export const getUser = async (userId = null) => {
  // Query dasar dengan pemisahan Income dan Expense
  const query = `
  SELECT 
    u.user_id, 
    u.username, 
    u.user_email, 
    u.role, 
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
    SUM(t.amount) as total_amount
  FROM transactions t 
  LEFT JOIN users u ON t.user_id = u.user_id 
  WHERE u.role != $1
`;

  const groupByClause = ` GROUP BY u.user_id, u.username, u.user_email, u.role`;

  if (userId !== null) {
    const condition = `${query} AND u.user_id = $2 ${groupByClause}`;
    const res = await pool.query(condition, ["admin", userId]);
    return res.rows;
  }

  const res = await pool.query(query + groupByClause, ["admin"]);
  return {
    user: res.rows,
  };
};
