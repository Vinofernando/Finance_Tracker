import { jwtDecode } from "jwt-decode";

export default function checkExpiredToken(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error("Gagal decode token:", error);
    return null;
  }
}

// const decoded = jwtDecode(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5LCJ1c2VybmFtZSI6InZpbm8iLCJlbWFpbCI6InZpbm9mZXJuYW5kbzQ4QGdtYWlsLmNvbSIsImlhdCI6MTc3MjQ0ODc1MywiZXhwIjoxNzcyNDUyMzUzfQ.mZ2g_80CdXp_vey4SW_DrZ41K4mjwYrKPGn7rih9Ems",
// );

// console.log(new Date(decoded.exp * 1000));
