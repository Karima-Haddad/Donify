import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalDashboardPage from "./pages/hospitalDashboradPage";
import HospitalLayout from "./layouts/HospitalLayout";
import DonorLayout from "./layouts/DonorLayout";
import Footer from "./components/footer";
import RegisterPage from "./pages/RegisterPage";           
import CreateBloodRequest from "./pages/CreateBloodRequest"; 
import DonationHistory from "./pages/DonationHistory";
import BloodRequestDetailsPage from "./pages/bloodRequestDetailsPage";


export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />  
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        {/* Hospital */}
        <Route element={<HospitalLayout />}>
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/create-request" element={<CreateBloodRequest />} />  
          <Route path="/hospital-dashboard-page" element={<HospitalDashboardPage />} />
          <Route path="/blood-request/:requestId" element={<BloodRequestDetailsPage />} />
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