import HospitalStatsCard from "../components/HospitalStatsCard";
import RecentRequestsCard from "../components/RecentRequestsCard";
import BloodShortageDashboard from "../components/BloodShortageDashboard";
import "../styles/hospitalDashboardPage.css";

export default function HospitalDashboardPage() {
  const hospitalName = localStorage.getItem("userName") || "Hôpital";

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {hospitalName} – Dashboard
        </h1>

        <button className="create-request-btn">
          + Créer une demande
        </button>
      </div>

      <div >
        <HospitalStatsCard />
        <BloodShortageDashboard />
        <RecentRequestsCard />
      </div>
    </div>
  );
}