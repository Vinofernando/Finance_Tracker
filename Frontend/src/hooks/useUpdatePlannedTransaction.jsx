import { useState } from "react";
import { updatePlannedTransaction } from "../services/updatePlannedTransaction";

export function UseUpdatePlannedTransaction(token) {
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: 0,
    description: "",
    type: "",
    startDate: "",
    frequency: "",
    plannedId: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updatePlannedTransaction(token, formData);
  };
  return {
    formData,
    setFormData,
    handleSubmit,
    handleChange,
  };
}
