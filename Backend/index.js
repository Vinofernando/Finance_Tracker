import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "https://finance-trackerv.netlify.app",
    "https://finance-tracker.store",
    "http://localhost:5173", // tetap izinkan local untuk testing
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;
app.use(morgan("combined"));

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

app.use(errorHandler);
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));
