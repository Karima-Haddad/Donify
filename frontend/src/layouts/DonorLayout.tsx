import { Outlet, Navigate } from "react-router-dom";
import DonorHeader from "../components/donorHeader";
import "../styles/donorHeader.css";


export default function DonorLayout() {
  // ✅ Récupération depuis localStorage (auth utilisateur)
  const donorId = localStorage.getItem("userId") || "";
  const donorName = localStorage.getItem("userName") || "Donneur";
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="donor-layout">
      {/* Header */}
      <DonorHeader donorId={donorId} donorName={donorName} />

      {/* Contenu des pages */}
      <main className="donor-layout__content">
        <Outlet />
      </main>
    </div>
  );
}