import pool from "../config/db.js";

export const getUserTransaction = async (userId, order = null) => {
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

  const condition = ` ORDER BY date ${order}`;
  if (order) {
    query += condition;
    const resultOrder = await pool.query(query, [userId]);
    return resultOrder.rows;
  }

  const result = await pool.query(query, [userId]);
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

  const result = await pool.query(
    `
      INSERT INTO transactions(user_id, amount, type, category_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [userId, amount, type, categoryId, description],
  );

  return {
    message: "Successfully add new transaction",
    data: result.rows,
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
  const balance = income - expense;

  return {
    income: Number(income),
    expense: Number(expense),
    balance,
  };
};

export const getUser = async (userId = null) => {
  const query = `SELECT user_id, username, user_email, role FROM users WHERE role != $1`;

  if (userId !== null) {
    const condition = `${query} AND user_id = $2 `;
    const res = await pool.query(condition, ["admin", userId]);
    return res.rows;
  }

  const res = await pool.query(query, ["admin"]);
  return res.rows;
};
