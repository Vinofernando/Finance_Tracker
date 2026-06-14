import { Form } from "react-router-dom";
import Calendar from "react-calendar";

export function UpdateCard({ formData, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <label>description</label>
      <input
        type="text"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <label>amount</label>
      <input
        type="text"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
      />
      <label>type</label>
      <select
        value={formData.type}
        onChange={(e) => handleChange("type", e.target.value)}
      >
        <option value="6">Pengeluaran tetap</option>
        <option value="7">Pemasukan tetap</option>
      </select>
      <label>Category</label>
      <select
        value={formData.categoryId}
        onChange={(e) => handleChange("categoryId", e.target.value)}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <label>Frequency</label>
      <select
        value={formData.frequency}
        onChange={(e) => handleChange("frequency", e.target.value)}
      >
        <option value="yearly">Yearly</option>
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
        <option value="daily">Daily</option>
      </select>
      <label>Start date</label>
      <Calendar
        onChange={(date) => handleChange("startDate", date)}
        value={formData.startDate}
      />
    </form>
  );
}
