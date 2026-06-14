import { useState, useEffect } from "react";
import "../style/addpages.css";
import { Link, useNavigate } from "react-router-dom";
import checkExpiredToken from "../utils/checkExpiredToken";
import useAuthStore from "../state/authStore";
import PlannedCard from "../components/plannedTransactionCard";
import AddPlannedTransaction from "../components/AddPlannedTransaction";
import { UseUpdatePlannedTransaction } from "../hooks/useUpdatePlannedTransaction";

const formatter = new Intl.NumberFormat("id-ID");

export default function AddPlanPages() {
  const { isAddPlanModalOpen, toggleAddPlanModal, method } = useAuthStore();
  const token = localStorage.getItem("token") || null;
  const { formData, handleChange, setFormData } = UseUpdatePlannedTransaction();
  const [disabled, setDisabled] = useState(false);
  const [plannedTransactions, setPlannedTransactions] = useState([]);
  const navigate = useNavigate();
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  async function getPlannedTransaction() {
    try {
      const response = await fetch(
        "https://api.finance-tracker.store/api/transaction/planned-transaction",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setPlannedTransactions(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }
  useEffect(() => {
    if (!token || checkExpiredToken(token) < new Date()) {
      navigate("/login");
      return;
    }
    getPlannedTransaction();
  }, [token]);

  const methodHTTP = method === "tambah" ? "POST" : "PUT";
  const url =
    method === "tambah"
      ? "https://api.finance-tracker.store/api/transaction/planned-transaction"
      : `https://api.finance-tracker.store/api/transaction/update-planned-transaction?plannedId=${formData.plannedId}`;
  async function formHandler(e) {
    setDisabled(true);
    e.preventDefault();

    try {
      if (!token || checkExpiredToken(token) < new Date()) {
        navigate("/login");
        return;
      }
      const response = await fetch(url, {
        method: methodHTTP,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: formData.categoryId,
          amount: Number(formData.amount),
          description: formData.description,
          type: formData.type,
          startDate: formatDate(formData.startDate),
          frequency: formData.frequency,
        }),
      });

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
      getPlannedTransaction();
      alert("Transaksi berhasil ditambahkan!");
    } catch (error) {
      setTimeout(() => {
        setDisabled(false);
      }, 300);
      return <div>{error.message}</div>;
    }
  }

  async function handleToggleActive(plannedId, currentActive) {
    try {
      const response = await fetch(
        "https://api.finance-tracker.store/api/transaction/update-planned-transaction-active",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !currentActive,
            plannedTransactionId: plannedId,
          }),
        },
      );

      if (!response.ok) {
        return;
      }

      setPlannedTransactions((prev) =>
        prev.map((item) =>
          item.planned_id === plannedId
            ? {
                ...item,
                is_active: !item.is_active,
              }
            : item,
        ),
      );
      getPlannedTransaction();
    } catch (err) {
      return <div>{err.message}</div>;
    }
  }

  useEffect(() => {}, [plannedTransactions]);

  const handleDelete = async (plannedId) => {
    setDisabled(true);
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus transaksi ini?",
    );

    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `https://api.finance-tracker.store/api/transaction/delete-planned-transaction?plannedId=${plannedId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setDisabled(false);
        return response.message;
      }

      alert("Berhasil menghapus transaksi");

      setPlannedTransactions((prev) =>
        prev.filter((item) => item.planned_id !== plannedId),
      );
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus transaksi");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="dashboard-container-add">
      <Link to={"/"} className="dashboard-link">
        Dashboard
      </Link>
      <AddPlannedTransaction
        isAddPlanModalOpen={isAddPlanModalOpen}
        formHandler={formHandler}
        formatter={formatter}
        formData={formData}
        handleChange={handleChange}
        disabled={disabled}
        toggleAddPlanModal={toggleAddPlanModal}
        setFormData={setFormData}
      />
      <button
        onClick={() => toggleAddPlanModal("tambah")}
        className="add-button"
        style={{ marginTop: "20px", width: "100%" }}
      >
        + Transaksi tetap baru
      </button>
      <PlannedCard
        plannedTransaction={plannedTransactions}
        handleToggle={handleToggleActive}
        toggleAddPlanModal={toggleAddPlanModal}
        setFormData={setFormData}
        handleDelete={handleDelete}
      />
    </div>
  );
}
