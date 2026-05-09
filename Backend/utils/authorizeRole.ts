import express from "express";
import type { Request } from "express";

export default function authorizeRole(...allowedRole: string[]) {
  return (req: Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized role" });
    }
    if (!req.user || !allowedRole.includes(req.user.role)) {
      return next({
        status: 403,
        message: "Akses ditolak",
      });
    }
    next();
  };
}
