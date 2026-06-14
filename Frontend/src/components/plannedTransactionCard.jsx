import "../style/fixedplantransaction.css";

export default function PlannedCard({
  plannedTransaction,
  handleToggle,
  toggleAddPlanModal,
  setFormData,
  handleDelete,
}) {
  return (
    <div className="planned-wrapper">
      <table className="planned-table">
        <thead>
          <tr>
            <th>Deskripsi</th>
            <th>Nominal</th>
            <th>Tipe</th>
            <th>Frekuensi</th>
            <th>Tanggal Mulai</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {plannedTransaction.map((t) => (
            <tr key={t.planned_id}>
              <td>{t.description}</td>

              <td>
                Rp{" "}
                {Number(t.amount).toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}
              </td>

              <td>
                <span
                  className={
                    t.type === "income" ? "badge income" : "badge expense"
                  }
                >
                  {t.type}
                </span>
              </td>

              <td>{t.frequency}</td>

              <td>{new Date(t.start_date).toLocaleDateString("id-ID")}</td>

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={t.is_active}
                    onChange={() => {
                      handleToggle(t.planned_id, t.is_active);
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      toggleAddPlanModal("update");
                      setFormData({
                        categoryId: t.category_id,
                        amount: t.amount,
                        description: t.description,
                        type: t.type,
                        startDate: t.start_date,
                        frequency: t.frequency,
                        plannedId: t.planned_id,
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(t.planned_id)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
