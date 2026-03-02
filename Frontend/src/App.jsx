import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPages from "./pages/AddTransactions";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import AuthManager from "./auth/AuthManager";

function App() {
  return (
    <BrowserRouter>
      <AuthManager />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-transaction" element={<AddPages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
