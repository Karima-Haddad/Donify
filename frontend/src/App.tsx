import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HospitalDashboardPage from "./pages/hospitalDashboradPage";
import HospitalLayout from "./layouts/HospitalLayout";
import DonorLayout from "./layouts/DonorLayout";
import Footer from "./components/footer";
import CreateBloodRequest from "./pages/CreateBloodRequest"; 
import DonationHistory from "./pages/DonationHistory";
import BloodRequestDetailsPage from "./pages/bloodRequestDetailsPage";
import DonorProfil from "./pages/DonorProfil";
import DonorProfileEdit from "./pages/DonorProfileEdit";
import HospitalProfileEdit from "./pages/HospitalProfileEdit";
import HospitalProfil from "./pages/HospitalProfil";
import BloodRequestHistory from "./pages/BloodRequestHistory";
import RegisterPage from "./pages/RegisterPage";


export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Hospital */}
        <Route element={<HospitalLayout />}>
          <Route path="/create-request" element={<CreateBloodRequest />} />  
          <Route path="/hospital-dashboard-page" element={<HospitalDashboardPage />} />
          <Route path="/blood-request/:requestId" element={<BloodRequestDetailsPage />} />
          <Route path="/hospital-profile-edit" element={<HospitalProfileEdit />} />
          <Route path="/hospital-profil" element={<HospitalProfil />} />
          <Route path="/my-requests" element={<BloodRequestHistory />} />
        </Route>

        {/* Donor */}
        <Route element={<DonorLayout />}>
          <Route path="/donor-profil" element={<DonorProfil />} />
          <Route path="/donor-profil/edit" element={<DonorProfileEdit />} />
          <Route path="/my-donations" element={<DonationHistory />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}