import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordVisible } from "../components/PasswordVisible";
import { Eye, EyeOff } from "lucide-react";
import "../style/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null); // Reset error setiap klik login
    setDisabled(true);
    try {
      const response = await fetch(
        "https://api.finance-tracker.store/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // WAJIB Stringify
        },
      );

      const data = await response.json(); // Ambil datanya

      console.log(email);
      console.log(password);
      if (!response.ok) {
        setTimeout(() => {
          setDisabled(false);
        }, 300);
        throw new Error(data.message || "Login gagal");
      }

      // Simpan token
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.username);
      localStorage.setItem("role", data.role);
      alert("Login Berhasil!");

      // Biasanya di sini kamu gunakan useNavigate dari react-router-dom
      // window.location.href = "/dashboard";
      if (data.role === "admin") {
        return navigate("/admin-dashboard");
      }

      navigate("/");
      setTimeout(() => {
        setDisabled(false);
      }, 300);
    } catch (err) {
      setTimeout(() => {
        setDisabled(false);
      }, 300);
      setError(err.message);
      console.error("CORS atau Network Error:", err);
    }
  }

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login-container">
      <div
        className="login-card"
        style={{ position: "relative", width: "300px" }}
      >
        <h2>Login</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email" // Gunakan type email untuk validasi dasar
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            style={{ paddingRight: "40px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="login-reset-visible"
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
        <Link to="/register" className="login-not-have-acc">
          Do not have account ?
        </Link>
        <Link to="/forgot-page" className="login-not-have-acc">
          Forgot password ?
        </Link>
      </div>
    </div>
  );
}
