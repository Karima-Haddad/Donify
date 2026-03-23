/**
 * Dashboard hôpital
 * Ce composant affiche les indicateurs principaux de l’hôpital
 * avec un design inspiré de la maquette validée.
 */

import { useEffect, useState } from "react";
import { FaList, FaCheckCircle, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { fetchHospitalDashboard } from "../api/hospitalDashboard";
import type { HospitalDashboardData } from "../types/dashboard";
import "../styles/HospitalDashboard.css";

export default function HospitalDashboard() {
  const [data, setData] = useState<HospitalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hospitalId = "f5dd3a9c-a553-4352-85e5-31208cf8355a";

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await fetchHospitalDashboard(hospitalId);
        setData(result);
      } catch (err) {
        setError("Impossible de charger le dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [hospitalId]);

  if (loading) {
    return <p className="dashboard-message">Chargement du dashboard...</p>;
  }

  if (error) {
    return <p className="dashboard-message error">{error}</p>;
  }

  if (!data) {
    return <p className="dashboard-message">Aucune donnée disponible.</p>;
  }

  return (
    <div className="hospital-dashboard-page">
      <div className="stats">
        <div className="card">
          <FaList className="card-icon" />
          <h3>Demandes actives</h3>
          <div className="value">{data.active_requests}</div>
        </div>

        <div className="card">
          <FaCheckCircle className="card-icon" />
          <h3>Dons validés</h3>
          <div className="value">{data.validated_donations}</div>
        </div>

        <div className="card">
          <FaChartLine className="card-icon" />
          <h3>Taux de réponse</h3>
          <div className="value">{data.response_rate}%</div>
        </div>

        <div className="card">
          <FaExclamationTriangle className="card-icon" />
          <h3>Stock critique</h3>
          <div className="value">
            {data.critical_stock?.blood_type ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}