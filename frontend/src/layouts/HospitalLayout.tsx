/**
 * Layout principal des pages hôpital
 */

import { Outlet, Navigate } from "react-router-dom";
import HospitalHeader from "../components/hospitalHeader";
import "../styles/hospitalHeader.css"


export default function HospitalLayout() {
  const hospitalId = localStorage.getItem("userId") || "";
  const hospitalName = localStorage.getItem("userName") || "Hôpital";
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!hospitalId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="hospital-layout">
      <HospitalHeader hospitalId={hospitalId} hospitalName={hospitalName} />

      <main className="hospital-layout__content">
        <Outlet />
      </main>
    </div>
  );
}