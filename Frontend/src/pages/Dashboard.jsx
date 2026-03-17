import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import checkExpiredToken from "../utils/checkExpiredToken";
import Calendar from "react-calendar";
import "../style/dashboard.css";
import "react-calendar/dist/Calendar.css";

export default function Dashboard() {
  const token = localStorage.getItem("token") || null;
  const name = localStorage.getItem("name") || "Guest";
  const role = localStorage.getItem("role") || "Guest";
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [sort, setSort] = useState("asc");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [filter, setFilter] = useState("all");
  const [refreshSignal, setRefreshSignal] = useState(0);

  // Fungsi pembantu (helper) untuk format YYYY-MM-DD lokal
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Di dalam komponen Anda:
  const start = formatDate(dateRange[0]);
  const end = formatDate(dateRange[1]);
  const today = formatDate(new Date());

  const navigate = useNavigate();

  async function handleDeleteTransaction(transactionId) {
    if (confirm("Apakah kamu yakin ini menghapus transaksi ini ?") == true) {
      try {
        const response = await fetch(
          `https://api.finance-tracker.store/api/transaction/delete-transaction/${transactionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          alert("Data sebelum: " + data.length);
          setData((prevData) => {
            const filtered = prevData.filter((t) => t.id !== transactionId);
            setRefreshSignal((prev) => prev + 1);
            alert("Data sesudah: " + filtered.length);
            return filtered;
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      return;
    }
  }
  useEffect(() => {
    if (!token || checkExpiredToken(token) < new Date()) {
      navigate("/login");
      return;
    }

    if (role !== "user") {
      navigate("/admin-dashboard");
      return;
    }

    const url = `https://api.finance-tracker.store/api/transaction?order=${sort || "asc"}${filter === "all" ? "" : `&start=${start || today}&end=${end || today}`}&t=${refreshSignal}`;
    Promise.all([
      fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch("https://api.finance-tracker.store/api/transaction/summary", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([transactions, summaryData]) => {
        setData(transactions || []);
        setSummary(summaryData);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setIsLoading(false));
    console.log("Sinyal Refresh Saat Ini:", refreshSignal);
  }, [token, navigate, sort, role, start, end, today, filter, refreshSignal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logoutHandler() {
    if (confirm("Apa kamu yakin ingin logout ?") == true) {
      localStorage.clear();
      navigate("/login");
    } else {
      return;
    }
  }

  useEffect(() => {}, [data, summary]);

  if (isLoading) {
    return <div className="loading-center">Memuat data keuangan...</div>;
  }
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2 className="welcome-text">Halo, Selamat Datang {name}!</h2>
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
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="" disabled>
            filter by
          </option>
          <option value="all">all</option>
          <option value="byDate">date</option>
        </select>
        {filter === "byDate" ? (
          <div ref={dropdownRef} className="profile-dropdown">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="profile-btn"
              style={{
                backgroundColor: "dodgerblue",
                border: "none",
                borderRadius: "10px",
                color: "white",
              }}
            >
              <div className="profile-name">
                <p style={{ margin: "0" }}>Filter by date</p>
              </div>
              <ChevronDown size={16} />
            </button>

            {isOpen && (
              <>
                <Calendar
                  onChange={setDateRange}
                  value={dateRange}
                  selectRange={true}
                />
              </>
            )}
          </div>
        ) : null}
        <select
          name=""
          id=""
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="" disabled>
            Sort by
          </option>
          <option value="asc">newest</option>
          <option value="desc">oldest</option>
        </select>
        <span style={{ fontSize: "12px", color: "#666" }}>
          {data.length} Transaksi
        </span>
      </div>

      {filter === "all" && <p className="filter-date">All trasaction</p>}
      {filter === "byDate" && start === end && start === today && (
        <p className="filter-date">Transaksi hari ini</p>
      )}
      {filter === "byDate" && start != end && (
        <p className="filter-date">
          From: {start} - To: {end}
        </p>
      )}
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
                <div className="user-transaction">
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
