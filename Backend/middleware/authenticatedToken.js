import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.SECRET_KEY;

export const authenticatedToken = async (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token)
    throw { status: 400, message: "You must login to access this page" };

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) throw { status: 403, message: "Token invalid" };

    req.user = user;
    next();
  });
};

export default authenticatedToken;
