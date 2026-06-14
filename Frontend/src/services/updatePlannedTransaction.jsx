export async function updatePlannedTransaction({ formData, token }) {
  return fetch(
    "http://127.0.0.1:5000/api/transaction/update-planned-transaction",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    },
  );
}
