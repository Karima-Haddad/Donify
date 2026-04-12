import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BloodShortageDashboard from "./components/BloodShortageDashboard";
import HospitalStatsCard from "./components/HospitalStatsCard";
import RecentRequestsCard from "./components/RecentRequestsCard";
import DonorProfil from "./pages/DonorProfil";
import HospitalProfil from "./pages/HospitalProfil";
import DonorProfileEdit from "./pages/DonorProfileEdit";
import HospitalProfileEdit from "./pages/HospitalProfileEdit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/hospital-profil" element={<HospitalProfil />} />
      <Route path="/donor-profil" element={<DonorProfil />} />
      <Route path="/test-shortage" element={<BloodShortageDashboard />} />
      <Route path="/stats-card" element={<HospitalStatsCard/>}/>
      <Route path="/recent-requests" element={<RecentRequestsCard/>} />
       <Route path="/donor-profil/edit" element={<DonorProfileEdit />} />
       <Route path="/hospital-profile-edit" element={<HospitalProfileEdit />} />
    </Routes>
  );
}

export default App;