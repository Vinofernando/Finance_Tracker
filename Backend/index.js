import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://financetrackerv.netlify.app",
  }),
);

const PORT = process.env.PORT || 5000;
app.use(morgan("combined"));

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

app.use(errorHandler);
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));
