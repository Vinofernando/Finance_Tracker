import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPages from "./pages/AddTransactions";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/about" element={<About />} />
        <Route path="/forgot-page" element={<ForgotPassword />} />
        <Route path="/reset-page" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
