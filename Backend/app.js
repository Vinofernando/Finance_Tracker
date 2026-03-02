import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

app.use(errorHandler);
app.listen(5000, () => console.log("Server running on 5000"));
