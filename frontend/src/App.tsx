import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HospitalDashboard from "./pages/HospitalDashboard";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
      <Route path="/donor-dashboard" element={<DonorDashboard />} />
    </Routes>
  );
}

export default App