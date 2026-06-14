import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordVisible } from "../components/PasswordVisible";
import { Eye, EyeOff } from "lucide-react";
import useAuthStore from "../state/authStore";
import "../style/login.css";
import loginImg from "../assets/Finance-login-hd.jpg";

export default function Login() {
  const { email, setEmail, password, setPassword, error, setError } =
    useAuthStore();
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
      <div className="margin flex">
        <div
          className="login-card z-10 flex flex-col items-center justify-end h-full pb-10"
          style={{ position: "relative" }}
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
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="w-full p-3 bg-transparent outline-none" // Hilangkan border & outline default
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="p-3 text-gray-500 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="forgot-btn"
              disabled={disabled}
              style={
                disabled ? { backgroundColor: "black" } : { color: "white" }
              }
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
        <div className="login-img w-full h-full bg-[url('../assets/login-img-2.jpg')] bg-cover bg-center bg-no-repeat">
          <img src={loginImg} alt="" />
        </div>
      </div>
    </div>
  );
}
