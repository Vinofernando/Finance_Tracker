import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      // Tambahkan properti user agar tersedia di SEMUA Request
      user?: {
        userId: number;
        username?: string;
        email?: string;
        role?: string;
      };
    }
  }
}
