import { useState } from "react";

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
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

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

  return (
    <>
      {loading && <h1>loading</h1>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
    </>
  );
}
