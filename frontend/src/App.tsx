import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import BloodShortageDashboard from "./components/BloodShortageDashboard";
import HospitalStatsCard from "./components/HospitalStatsCard";
import RecentRequestsCard from "./components/RecentRequestsCard";
import HospitalLayout from "./layouts/HospitalLayout";
import DonorLayout from "./layouts/DonorLayout";
import Footer from "./components/footer";
import RegisterPage from "./pages/RegisterPage";           
import CreateBloodRequest from "./pages/CreateBloodRequest"; 
import BloodRequestHistory from "./pages/BloodRequestHistory";
import DonationHistory from "./pages/DonationHistory";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />  {/* ← ajouté */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Hospital */}
        <Route element={<HospitalLayout />}>
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/create-request" element={<CreateBloodRequest />} />  
          <Route path="/test-shortage" element={<BloodShortageDashboard />} />
          <Route path="/stats-card" element={<HospitalStatsCard />} />
          <Route path="/recent-requests" element={<RecentRequestsCard />} />
          <Route path="/my-requests" element={<BloodRequestHistory />} />
        </Route>

        {/* Donor */}
        <Route element={<DonorLayout />}>
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/my-donations" element={<DonationHistory />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}