export default function authorizeRole(...allowedRole) {
  return (req, res, next) => {
    if (!req.user || !allowedRole.includes(req.user.role)) {
      return next({
        status: 403,
        message: "Akses ditolak",
      });
    }
    next();
  };
}
