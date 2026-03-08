import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/dashboard.css"; // <--- Import CSS di sini

export default function Dashboard() {
  const token = localStorage.getItem("token") || null;
  const name = localStorage.getItem("name") || "Guest";
  const role = localStorage.getItem("role") || "Guest";
  const [data, setData] = useState([]); // Inisialisasi sebagai array kosong agar .map tidak error
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [sort, setSort] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "user") {
      navigate("/admin-dashboard");
      return;
    }
    Promise.all([
      fetch(
        `http://localhost:5000/api/transaction${sort ? `?order=${sort}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ).then((res) => res.json()),
      fetch("http://localhost:5000/api/transaction/summary", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([transactions, summaryData]) => {
        setData(transactions || []);
        setSummary(summaryData);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setIsLoading(false));
  }, [token, navigate, sort, data]);

  function logoutHandler() {
    localStorage.clear();
    navigate("/login");
  }

  async function handleDeleteTransaction(transactionId) {
    if (confirm("Apakah kamu yakin ini menghapus transaksi ini ?") == true) {
      try {
        await fetch(
          `http://localhost:5000/api/transaction/delete-transaction/${transactionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      return;
    }
  }

  if (isLoading) {
    return <div className="loading-center">Memuat data keuangan...</div>;
  }
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2 className="welcome-text">
            Halo, Selamat Datang {name}! role: ({role})
          </h2>
          <p className="date-text">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button onClick={logoutHandler} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="balance-card">
        <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
          Total Saldo Anda
        </p>
        <h1 className="balance-amount">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(summary?.balance || 0)}
        </h1>
      </div>

      <div className="section-option">
        <Link to={"/add-transaction"}>Add</Link>
      </div>
      <div className="section-header">
        <h3 style={{ margin: 0 }}>Riwayat Transaksi</h3>
        <select
          name=""
          id=""
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="asc">newest</option>
          <option value="desc">oldest</option>
        </select>
        <span style={{ fontSize: "12px", color: "#666" }}>
          {data.length} Transaksi
        </span>
      </div>

      <div className="list-container">
        {data.length > 0 ? (
          data.map((transaction) => (
            <div key={transaction.transaction_id} className="transaction-card">
              <div className="card-left">
                <div
                  className={`icon ${transaction.type === "income" ? "icon-in" : "icon-out"}`}
                >
                  {transaction.type === "income" ? "↓" : "↑"}
                </div>
                <div>
                  <h4 className="description">{transaction.description}</h4>
                  <p className="type-tag">{transaction.type.toUpperCase()}</p>
                  <p className="type-date">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium", // Hasil: 25 Des 2023
                      timeStyle: "short", // Hasil: 14.30
                    }).format(new Date(transaction.date))}
                  </p>
                </div>
              </div>
              <div
                className={`amount ${transaction.type === "income" ? "amount-in" : "amount-out"}`}
              >
                Rp
                {transaction.type === "income" ? "+" : "-"}
                {new Intl.NumberFormat("id-ID").format(transaction.amount)}
              </div>
              <div>
                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteTransaction(transaction.transaction_id)
                  }
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-text">Belum ada transaksi.</p>
        )}
      </div>
    </div>
  );
}
