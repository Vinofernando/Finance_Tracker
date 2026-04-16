import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordVisible } from "../components/PasswordVisible";
import { Eye, EyeOff } from "lucide-react";
import "../style/forgot.css";

export default function ResetPassword() {
  const [disabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  async function handleResetPass(e) {
    e.preventDefault();
    setDisabled(true);
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.finance-tracker.store/api/auth/reset-password?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: newPassword,
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
      setTimeout(() => {
        navigate("/login");
      });
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
      <div
        className="forgot-card"
        style={{ position: "relative", width: "300px" }}
      >
        <h1>Reset password</h1>
        <form onSubmit={handleResetPass} className="forgot-form">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              style={{ paddingRight: "40px" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="reset-pass-visible"
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
              style={
                disabled ? { bacgroundColor: "black" } : { color: "white" }
              }
            >
              submit
            </button>
          </div>
        </form>
        {loading && <p>Sedang memperbarui password...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
