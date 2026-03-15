import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? false // Matikan SSL jika konek ke DB lokal
    : {
        rejectUnauthorized: false, // Seringkali dibutuhkan untuk cloud DB jika tidak punya file CA
      },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
export default pool;
