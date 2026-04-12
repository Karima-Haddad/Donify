import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HospitalStatsCard from "../components/HospitalStatsCard";
import BloodShortageDashboard from "../components/BloodShortageDashboard";
import RecentRequestsCard from "../components/RecentRequestsCard";

import { fetchHospitalDashboard } from "../api/hospitalDashboard";
import { fetchRecentBloodRequests } from "../api/bloodRequests";
import { fetchHospitalShortagePredictions, type Prediction } from "../api/shortage";

import type { HospitalDashboardData } from "../types/dashboard";
import type { RecentBloodRequest } from "../types/bloodRequest";


import "../styles/HospitalDashboardPage.css"; 

export default function HospitalDashboardPage() {
  const hospitalName = localStorage.getItem("userName") || "Hôpital";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statsData, setStatsData] = useState<HospitalDashboardData | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentBloodRequest[]>([]);
  const [shortagePredictions, setShortagePredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    async function loadAllDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;

        if (!user || !user.id) {
          throw new Error("Aucun utilisateur connecté.");
        }

        if (user.role !== "hospital") {
          throw new Error("Accès refusé.");
        }

        const [dashboardResult, recentRequestsResult, shortageResult] =
          await Promise.all([
            fetchHospitalDashboard(user.id),
            fetchRecentBloodRequests(user.id),
            fetchHospitalShortagePredictions(user.id),
          ]);

        setStatsData(dashboardResult);
        setRecentRequests(recentRequestsResult);
        setShortagePredictions(shortageResult.predictions);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadAllDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Chargement du dashboard...
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="dashboard-loading dashboard-loading-error">
        {error || "Erreur de chargement."}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">
          {hospitalName} – Dashboard
        </h1>

        <button
          className="create-request-btn"
          onClick={() => navigate("/create-request")}
        >
          + Créer une demande
        </button>
      </div>

      <div className="dashboard-content">
        <div className="fade-in fade-delay-1">
          <HospitalStatsCard data={statsData} />
        </div>

        <div className="fade-in fade-delay-2">
          <BloodShortageDashboard data={shortagePredictions} />
        </div>

        <div className="fade-in fade-delay-3">
          <RecentRequestsCard requests={recentRequests} />
        </div>
      </div>
    </div>
  );
}