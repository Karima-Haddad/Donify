import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HospitalDashboard from "./pages/HospitalDashboard";
import RegisterPage from "./pages/RegisterPage";
import CreateBloodRequest from "./pages/CreateBloodRequest";


import DonorDashboard from "./pages/DonorDashboard";
import BloodShortageDashboard from "./components/BloodShortageDashboard";
import HospitalStatsCard from "./components/HospitalStatsCard";
import RecentRequestsCard from "./components/RecentRequestsCard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
      <Route path="/create-request" element={<CreateBloodRequest />} />

      <Route path="/donor-dashboard" element={<DonorDashboard />} />
      <Route path="/test-shortage" element={<BloodShortageDashboard />} />
      <Route path="/stats-card" element={<HospitalStatsCard/>}/>
      <Route path="/recent-requests" element={<RecentRequestsCard/>} />
    </Routes>
  );
}

export default App;