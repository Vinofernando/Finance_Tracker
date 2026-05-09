import "../style/segmentedcontrol.css";
import { motion as Motion, AnimatePresence } from "framer-motion";

const SegmentedControl = ({ filter, setFilter, sort, setSort }) => {
  const optionsFilter = [
    { id: "all", label: "Semua" },
    { id: "byDate", label: "Tanggal" },
  ];

  const optionsSort = [
    { id: "desc", label: "Terbaru" },
    { id: "asc", label: "Terlama" },
  ];
  return (
    <Motion.div
      className="segmented-control-container"
      // HAPUS properti key={filter} agar objek tidak dianggap baru saat filter berubah

      // Tentukan posisi awal (hanya saat pertama kali render)
      initial={{ opacity: 1, x: 5 }}
      // Framer Motion akan otomatis menganimasi perubahan dari x lama ke x baru
      animate={{
        x: filter === "byDate" ? -10 : 10,
        opacity: 1, // Pastikan opacity tetap 1 agar tidak fade
      }}
      transition={{
        duration: 0.5,
        // ease: "easeInOut", // Tambahkan easing agar gerakan lebih terasa organik/halus
      }}
    >
      <div className="segmented-control">
        {optionsFilter.map((option) => (
          <button
            key={option.id}
            className={`segmented-item ${filter === option.id ? "active" : ""}`}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
        {/* Opsional: Indikator latar belakang yang bergeser */}
        <div
          className="segmented-highlight"
          style={{
            width: `$47%`,
            transform: `translateX(${optionsFilter.findIndex((o) => o.id === filter) * 100}%)`,
          }}
        />
      </div>
      <div className="segmented-control-sort">
        {optionsSort.map((option) => (
          <button
            key={option.id}
            className={`segmented-item-sort ${sort === option.id ? "active" : ""}`}
            onClick={() => setSort(option.id)}
          >
            {option.label}
          </button>
        ))}
        {/* Opsional: Indikator latar belakang yang bergeser */}
        <div
          className="segmented-highlight"
          style={{
            width: `47%`,
            transform: `translateX(${optionsSort.findIndex((o) => o.id === sort) * 100}%)`,
          }}
        />
      </div>
    </Motion.div>
  );
};

export default SegmentedControl;
