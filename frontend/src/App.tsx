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

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Hospital */}
        <Route element={<HospitalLayout />}>
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/test-shortage" element={<BloodShortageDashboard />} />
          <Route path="/stats-card" element={<HospitalStatsCard/>}/>
          <Route path="/recent-requests" element={<RecentRequestsCard/>} />
        </Route>

        {/* Donor */}
        <Route element={<DonorLayout />}>
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );

}
