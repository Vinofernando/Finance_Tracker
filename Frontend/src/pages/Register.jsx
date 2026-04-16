import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { PasswordVisible } from "../components/PasswordVisible";
import "../style/login.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    try {
      setDisabled(true);
      setLoading(true);
      const response = await fetch(
        "https://api.finance-tracker.store/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        setTimeout(() => {
          setDisabled(false);
        }, 400);
        throw new Error(data.message || "Error");
      }
      setTimeout(() => {
        setDisabled(false);
      }, 400);
      setLoading(true);
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error("(register) Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    });
  }, [error]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="register-container">
      <div
        className="register-card"
        style={{ position: "relative", width: "300px" }}
      >
        <h1>Register</h1>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            type="text"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            style={{ paddingRight: "40px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="register-reset-visible"
            type="button"
            onClick={togglePassword}
          >
            {" "}
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
          </button>
          <button
            type="submit"
            className="forgot-btn"
            disabled={disabled}
            style={disabled ? { bacgroundColor: "black" } : { color: "white" }}
          >
            submit
          </button>
        </form>
        <Link to="/login" className="register-have-acc">
          have account ?
        </Link>
        {loading && <p>Sedang mendaftarkan akun</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
