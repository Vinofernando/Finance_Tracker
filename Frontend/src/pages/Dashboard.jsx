import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import checkExpiredToken from "../utils/checkExpiredToken";
import Calendar from "react-calendar";
import "../style/dashboard.css";
import "react-calendar/dist/Calendar.css";
import SimpleBarChart from "../components/SimpleBarChart";
import PieChartWithCustomizedLabel from "../components/PieCharts";
import SegmentedControl from "../components/SegmentedControl";
("use client");
import { motion as Motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../state/authStore";
import AddPages from "./AddTransactions";

export default function Dashboard() {
  const { isAddModalOpen, toggleAddModal } = useAuthStore();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const getDay = new Date(thisYear, thisMonth + 1, 0);
  const token = localStorage.getItem("token") || null;
  const name = localStorage.getItem("name") || "Guest";
  const role = localStorage.getItem("role") || "Guest";
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [sort, setSort] = useState("asc");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dateRange, setDateRange] = useState([
    new Date(`${thisYear}-${thisMonth + 1}-1`),
    new Date(`${thisYear}-${thisMonth + 1}-${getDay.getDate()}`),
  ]);
  const [filter, setFilter] = useState("byDate");
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [getThisMonthBalance, setGetThisMonthBalance] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          setTimeout(() => {
            setRefreshSignal((prev) => prev + 1);
          }, 500);
          alert("Transaksi berhasil dihapus!");
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

    const url = `https://api.finance-tracker.store/api/transaction?order=${sort || "asc"}${filter === "all" ? "" : `&start=${start || today}&end=${end || today}`}`;
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
        setSummary(summaryData.data);
        setGetThisMonthBalance(summaryData.data[thisMonth].balance);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setIsLoading(false));
    console.log("Sinyal Refresh Saat Ini:", refreshSignal);
  }, [
    token,
    navigate,
    sort,
    role,
    start,
    end,
    today,
    filter,
    refreshSignal,
    thisMonth,
    data,
  ]);

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

  console.log(isMenuOpen);
  return (
    <div>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex w-full justify-center"
      >
        {/* Icon Hamburger SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Dropdown Menu Mobile */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 mx-4 p-4 bg-white border border-zinc-100 rounded-2xl shadow-xl md:hidden flex flex-col gap-4 z-50">
          <div className="flex items-center gap-3 px-2 border-b border-gray-50 pb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
              {name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">{name}</span>
              <span className="text-xs text-gray-400">Rabu, 6 Mei 2026</span>
            </div>
          </div>

          <button
            onClick={logoutHandler}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
      <div className="hidden md:flex profile-header justify-center m-10 sticky top-20 z-50">
        <nav className="flex items-center justify-between px-8 py-4 sticky top-0 z-1 w-1/2 border border-zinc-100 rounded-4xl bg-white md:w-3/4">
          {/* Sisi Kiri: Logo atau Nama Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">
              <span className="text-purple-600">Finance</span>Tracker
            </span>
          </div>

          {/* Sisi Kanan: User Info & Logout */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-700">
                Halo, {name}!
              </span>
              <span className="text-xs text-gray-400">
                {" "}
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div> {/* Separator */}
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>
      <div className="dashboard-container z-10 relative">
        <div className="balance-section">
          <div className="balance-card" style={{ width: "100%" }}>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
              Total Saldo Anda
            </p>
            <h1 className="balance-amount">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(getThisMonthBalance || 0)}
            </h1>
          </div>
          <button
            onClick={toggleAddModal}
            className="add-button"
            style={{ width: "100%" }}
          >
            + Transaksi baru
          </button>
          <AnimatePresence>
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white p-6 rounded-lg w-full max-w-md flex flex-col items-center"
                >
                  <h2 className="font-extrabold text-xl">Tambah Transaksi</h2>
                  <AddPages />
                  <button onClick={toggleAddModal} className="cancel-btn">
                    Batal
                  </button>
                </Motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
        <div style={{ width: "70%" }} className="chart-section">
          <h3 style={{ display: "flex", justifyContent: "center" }}>
            Analitic transaction by month
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SimpleBarChart
              data={summary}
              month="month"
              income="income"
              expense="expense"
              balance="balance"
            />
          </div>
        </div>
      </div>

      <header className="dashboard-header">
        {/* <div>
            <Link to={"/about"} className="dashboard-about">
              About
            </Link>
            <h2 className="welcome-text">Halo, Selamat Datang {name}!</h2>
            <p className="date-text">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div> */}
        {/* <button onClick={logoutHandler} className="logout-btn">
            Logout
          </button> */}
      </header>

      <div style={{ margin: "0 30px" }}>
        <div className="section-header">
          <h3 style={{ margin: 0 }}>Riwayat Transaksi</h3>
          <span style={{ fontSize: "12px", color: "#666" }}>
            {data.length} Transaksi
          </span>
          <div className="header-filter">
            <SegmentedControl
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />
            <AnimatePresence mode="wait">
              <Motion.div
                key={filter}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.5,
                }}
              >
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
              </Motion.div>
            </AnimatePresence>
          </div>
        </div>

        {filter === "all" && <p className="filter-date">All transaction</p>}
        {filter === "byDate" && start === end && start === today && (
          <p className="filter-date">Transaksi hari ini</p>
        )}
        {filter === "byDate" && start != end && (
          <p className="filter-date">
            From: {start} - To: {end}
          </p>
        )}
        <AnimatePresence mode="wait">
          <Motion.div
            className="list-container"
            key={filter}
            initial={{ opacity: 0, y: 50 }} // Starts 50px down
            animate={{ opacity: 1, y: 0 }} // Moves up to original position
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {" "}
            {data.length > 0 ? (
              data.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className="transaction-card group"
                >
                  <div className="card-left">
                    <div
                      className={`icon ${transaction.type === "income" ? "icon-in" : "icon-out"}`}
                    >
                      {transaction.type === "income" ? "↓" : "↑"}
                    </div>
                    <div className="user-transaction">
                      <h4 className="description">{transaction.description}</h4>
                      <p className="type-tag">
                        {transaction.type.toUpperCase()}
                      </p>
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
                      className="delete-btn invisible group-hover:visible bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                      onClick={() =>
                        handleDeleteTransaction(transaction.transaction_id)
                      }
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-text">Belum ada transaksi.</p>
            )}
          </Motion.div>
        </AnimatePresence>
      </div>
      {/* <div>
        <PieChartWithCustomizedLabel />
      </div> */}
    </div>
  );
}
