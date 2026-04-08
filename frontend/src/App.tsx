import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import BloodShortageDashboard from "./components/BloodShortageDashboard";
import HospitalStatsCard from "./components/HospitalStatsCard";
import RecentRequestsCard from "./components/RecentRequestsCard";
import HospitalDashboardPage from "./pages/hospitalDashboradPage";
import HospitalLayout from "./layouts/HospitalLayout";
import DonorLayout from "./layouts/DonorLayout";
import Footer from "./components/footer";
import BloodRequestDetailsPage from "./pages/bloodRequestDetailsPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={ <RegisterPage/>} />

        {/* Hospital */}
        <Route element={<HospitalLayout />}>
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/test-shortage" element={<BloodShortageDashboard />} />
          <Route path="/stats-card" element={<HospitalStatsCard/>}/>
          <Route path="/recent-requests" element={<RecentRequestsCard/>} />
          <Route path="/hospital-dashboard-page" element={<HospitalDashboardPage />} />
          <Route path="/blood-request/:requestId" element={<BloodRequestDetailsPage />} />
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
