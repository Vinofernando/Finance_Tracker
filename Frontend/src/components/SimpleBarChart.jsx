import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import "../style/recharts.css";

// #region Sample data

// #endregion
export default function SimpleBarChart({
  data,
  month,
  income,
  expense,
  balance,
}) {
  return (
    <div className="chart-section-1">
      <div className="chart-title"></div>
      {/* Cukup gunakan aspect saja, hapus height="100%" jika ingin rasio tetap */}
      <ResponsiveContainer width="80%" aspect={1.618}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={month} interval={0} textAnchor="end" height={60} />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={income}
            fill="#79e65e"
            activeBar={{ fill: "pink", stroke: "green" }}
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey={expense}
            fill="#f14848"
            activeBar={{ fill: "gold", stroke: "red" }}
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey={balance}
            fill="#fa9638"
            activeBar={{ fill: "brown", stroke: "orange" }}
            radius={[10, 10, 0, 0]}
          />
          <RechartsDevtools />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
