import { motion as Motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";

export default function AddPlannedTransaction({
  isAddPlanModalOpen,
  formHandler,
  disabled,
  toggleAddPlanModal,
  formData,
  setFormData,
  handleChange,
}) {
  return (
    <AnimatePresence>
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-6 rounded-lg w-full max-w-md flex flex-col items-center"
          >
            <h2 className="font-extrabold text-xl">Tambah Transaksi tetap</h2>
            <form onSubmit={formHandler} className="add-transaction-form">
              <input
                type="text"
                value={formData.description ?? ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description"
              />
              <input
                type="text"
                value={Math.trunc(formData.amount) ?? ""}
                onChange={(e) => handleChange("amount", Number(e.target.value))}
                placeholder="Amount"
              />
              <select
                name=""
                id=""
                value={formData.type ?? ""}
                onChange={(e) => handleChange("type", e.target.value)}
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
                value={formData.categoryId ?? ""}
                onChange={(e) => handleChange("categoryId", e.target.value)}
              >
                <option value="" disabled>
                  -- Pilih Kategori --
                </option>
                <option value={6}>Pengeluaran tetap</option>
                <option value={7}>Pemasukan tetap</option>
              </select>
              <Calendar
                onChange={(date) => {
                  const dates = date.getDate();
                  const month = date.getMonth() + 1;
                  const year = date.getFullYear();
                  handleChange("startDate", `${year}-${month}-${dates}`);
                }}
                value={formData.startDate ?? ""}
              />
              <select
                name=""
                id=""
                value={formData.frequency ?? ""}
                onChange={(e) => handleChange("frequency", e.target.value)}
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
              <button
                type="submit"
                disabled={disabled}
                className={!disabled ? "add-btn" : "add-btn-disabled"}
              >
                Add
              </button>
            </form>
            <button
              onClick={() => {
                setFormData({
                  categoryId: "",
                  amount: 0,
                  description: "",
                  type: "",
                  startDate: "",
                  frequency: "",
                });
                toggleAddPlanModal();
              }}
              className="cancel-btn"
            >
              Batal
            </button>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
