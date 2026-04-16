import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/forgot.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  async function handleForgot(e) {
    e.preventDefault();
    try {
      setDisabled(true);
      setLoading(true);
      const response = await fetch(
        "https://api.finance-tracker.store/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );

      const data = await response.json();
      console.log(data);
      alert(data.message);
      setTimeout(() => {
        setDisabled(false);
      }, 400);
      if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || "Error");
      }
      setLoading(true);
    } catch (err) {
      setError(err.message);
      console.error("(forgot) Gagal fetch:", err);
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
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>Forgot password</h1>
        <form onSubmit={handleForgot} className="forgot-form">
          <input
            type="text"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <button
            type="submit"
            className="forgot-btn"
            disabled={disabled}
            style={disabled ? { color: "gray" } : { color: "white" }}
          >
            submit
          </button>
        </form>
        <Link to="/login" className="forgot-have-acc">
          have account ?
        </Link>
        {loading && <p>Sedang mengirimkan link reset password</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
