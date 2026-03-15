import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    try {
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
        throw new Error(data.message || "Error");
      }
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
  return (
    <div className="register-container">
      <div className="register-card">
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
            type="text"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button type="submit" className="register-btn">
            Register
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
