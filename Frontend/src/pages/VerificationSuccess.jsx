import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function VerificationSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading...");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah double execution

    async function verify() {
      if (!token || !isMounted) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify?token=${token}`,
        );
        const data = await res.json();

        if (isMounted) {
          if (res.ok) {
            setStatus("success");
            setMessage(data.message);
          } else {
            setStatus("error");
            setMessage(data.message);
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          setMessage("Koneksi gagal", err);
        }
      }
    }

    verify();

    return () => {
      isMounted = false;
    }; // Cleanup function
  }, [token]);
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {status === "loading" && <h1>Sedang memverifikasi...</h1>}

      {status === "success" && (
        <div>
          <h1 style={{ color: "green" }}>Verifikasi Berhasil!</h1>
          <p>{message}</p>
          <Link to="/login">Klik di sini untuk Login</Link>
        </div>
      )}

      {status === "error" && (
        <div>
          <h1 style={{ color: "red" }}>Verifikasi Gagal</h1>
          <p>{message}</p>
          <Link to="/register">Coba daftar kembali</Link>
        </div>
      )}
    </div>
  );
}
