import { useState } from "react";
import "../style/addpages.css";
import { Link } from "react-router-dom";

export default function AddPages() {
  const token = localStorage.getItem("token") || null;
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  async function formHandler(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/transaction/add-transaction",
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
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("Transaksi berhasil ditambahkan!");
    } catch (error) {
      return <div>{error.message}</div>;
    }

    console.log(amount, description, type, categoryId);
  }
  return (
    <div className="dashboard-container-add">
      <Link to={"/"} className="add-transaction-back">
        Kembali
      </Link>
      <form onSubmit={formHandler}>
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
          <option>income</option>
          <option>expense</option>
        </select>
        <select
          name=""
          id=""
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value={1}>Transportasi</option>
          <option value={2}>Makanan/minuman</option>
          <option value={3}>Pemindahan dana</option>
          <option value={4}>Gaji</option>
        </select>
        <input
          type="text"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
