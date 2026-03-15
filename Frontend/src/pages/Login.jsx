import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null); // Reset error setiap klik login

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

      if (!response.ok) {
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
    } catch (err) {
      setError(err.message);
      console.error("CORS atau Network Error:", err);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
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
          <br />
          <input
            type="password" // Gunakan type password agar teks tersembunyi
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
          <br />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <Link to="/register" className="login-not-have-acc">
          Do not have account ?
        </Link>
      </div>
    </div>
  );
}
