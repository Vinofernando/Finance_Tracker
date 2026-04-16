import { useState } from "react";
import "../style/addpages.css";
import { Link, useNavigate } from "react-router-dom";
import checkExpiredToken from "../utils/checkExpiredToken";

export default function AddPages() {
  const token = localStorage.getItem("token") || null;
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  async function formHandler(e) {
    setDisabled(true);
    e.preventDefault();

    try {
      if (!token && checkExpiredToken(token) < new Date()) {
        navigate("/login");
      }
      const response = await fetch(
        "https://api.finance-tracker.store/api/transaction/add-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
            type,
            categoryId: Number(categoryId),
            description,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert(`Error: ${errorData.message || "Terjadi kesalahan pada server"}`);
        setTimeout(() => {
          setDisabled(false);
        }, 300);
        return;
      }
      setTimeout(() => {
        setDisabled(false);
      }, 300);
      alert("Transaksi berhasil ditambahkan!");
    } catch (error) {
      setTimeout(() => {
        setDisabled(false);
      }, 300);
      return <div>{error.message}</div>;
    }
  }
  return (
    <div className="dashboard-container-add">
      <Link to={"/"} className="add-transaction-back">
        Kembali
      </Link>
      <form onSubmit={formHandler} className="add-transaction-form">
        <input
          type="text"
          value={amount ?? ""}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <select
          name=""
          id=""
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" disabled>
            -- Pilih Kategori --
          </option>
          <option value={"income"}>income</option>
          <option value={"expense"}>expense</option>
        </select>
        <select
          name=""
          id=""
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="" disabled>
            -- Pilih Kategori --
          </option>
          <option value={1}>Transportasi</option>
          <option value={2}>Makanan/minuman</option>
          <option value={3}>Pemindahan dana</option>
          <option value={4}>Gaji</option>
          <option value={5}>Lainnya</option>
        </select>
        <input
          type="text"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit" disabled={disabled}>
          Add
        </button>
      </form>
    </div>
  );
}
