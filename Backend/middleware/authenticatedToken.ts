import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { User } from "../interfaces/interfaces.js";
const JWT_SECRET = process.env.SECRET_KEY;

// interface AuthRequest extends Request {
//   user?: User | string | jwt.JwtPayload;
// }
export const authenticatedToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token)
    throw { status: 401, message: "You must login to access this page" };

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as User;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
};

export default authenticatedToken;
