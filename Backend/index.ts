import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import express from "express";
import cron from "node-cron";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import morgan from "morgan";
import processPlannedTransactions from "./utils/automaticPlannedTransaction.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "https://finance-trackerv.netlify.app",
    "https://finance-tracker.store",
    "http://localhost:5173",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Menjalankan pengecekan transaksi terencana...");

    try {
      await processPlannedTransactions();
      console.log("Pengecekan transaksi selesai dengan sukses.");
    } catch (error) {
      // Log error atau kirim notifikasi ke Telegram/Slack/Email agar kamu tahu kalau gagal
      console.error("Gagal menjalankan pengecekan transaksi:", error);
    }
  },
  {
    timezone: "Asia/Jakarta", // Memastikan jalan jam 12 malam WIB
  },
);

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;
app.use(morgan("combined"));

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

app.use(errorHandler);
app.listen(Number(PORT), "0.0.0.0", () =>
  console.log(`Server running on ${PORT}`),
);
