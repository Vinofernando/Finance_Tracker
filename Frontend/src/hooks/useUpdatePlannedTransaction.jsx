import { useState } from "react";

export function UseUpdatePlannedTransaction() {
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

  return {
    formData,
    setFormData,
    handleChange,
  };
}
