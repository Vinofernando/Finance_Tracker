import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import checkExpiredToken from "../utils/checkExpiredToken";

export default function AuthManager() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  let name = localStorage.getItem("name");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const verifyToken = () => {
      const currentToken = token;

      if (!currentToken) return;

      const expDate = checkExpiredToken(currentToken);
      if (expDate && expDate < new Date()) {
        console.warn("Session expired. Logging out...");
        localStorage.clear();
        setToken(null);
        name(null);
        navigate("/login");
      }
    };

    verifyToken();

    const interval = setInterval(verifyToken, 3000);

    return () => clearInterval(interval);
  }, [navigate, location.pathname, token, name]);
  return null;
}
