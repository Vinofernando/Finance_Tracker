import { UpdatePlannedTransaction } from "../services/updatePlannedTransaction";
import { UseUpdatePlannedTransaction } from "../hooks/useUpdatePlannedTransaction";
import { UpdateCard } from "../components/updatePlannedTransactionCard";

export default function PlannedDashboard() {
  const token = localStorage.getItem("token") || null;
  const { formData, handleSubmit, handleChange } =
    UseUpdatePlannedTransaction(token);

  return (
    <div>
      <UpdateCard
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
