import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import UserDashboard from "./pages/UserDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import RegisterPage from "./pages/RegisterPage";
import CreateBloodRequest from "./pages/CreateBloodRequest";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
      <Route path="/create-request" element={<CreateBloodRequest />} />

    </Routes>

  )
}

export default App