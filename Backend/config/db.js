import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Tambahkan ini untuk memastikan error koneksi tidak membuat aplikasi 'hang'
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});
export default pool;
