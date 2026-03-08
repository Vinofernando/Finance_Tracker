import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPages from "./pages/AddTransactions";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import AuthManager from "./auth/AuthManager";
import VerificationSuccess from "./pages/VerificationSuccess";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthManager />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-transaction" element={<AddPages />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/success-verification/"
          element={<VerificationSuccess />}
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
