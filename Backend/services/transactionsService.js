import pool from "../config/db.js";

export const getUserTransaction = async (userId) => {
  const result = await pool.query(
    `SELECT 
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
    `,
    [userId],
  );

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
