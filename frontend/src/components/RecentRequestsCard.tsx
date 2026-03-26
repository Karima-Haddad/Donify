/**
 * Ce composant affiche les 5 dernières demandes de sang
 * d’un hôpital sous forme de tableau.
 * ============================================================
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRecentBloodRequests } from "../api/bloodRequests";
import type { RecentBloodRequest } from "../types/bloodRequest";
import "../styles/RecentRequestsCard.css";

export default function RecentRequestsCard() {
  const [requests, setRequests] = useState<RecentBloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError("");

        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;

        if (!user || user.role !== "hospital") {
          throw new Error("Accès refusé.");
        }

        const data = await fetchRecentBloodRequests(user.id);
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les demandes récentes.");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusLabel(status: RecentBloodRequest["status"]) {
    switch (status) {
      case "open":
        return "Active";
      case "in_progress":
        return "En cours";
      case "satisfied":
        return "Clôturée";
      case "expired":
        return "Expirée";
      default:
        return status;
    }
  }

  function getStatusClass(status: RecentBloodRequest["status"]) {
    switch (status) {
      case "open":
        return "status-badge active";
      case "in_progress":
        return "status-badge progress";
      case "satisfied":
        return "status-badge closed";
      case "expired":
        return "status-badge expired";
      default:
        return "status-badge";
    }
  }

  return (
    <div className="recent-requests-card">
      <div className="recent-requests-header">
        <h2>Demandes récentes</h2>
        <Link to="/hospital/requests-history" className="history-link">
          Voir tout l’historique
        </Link>
      </div>

      {loading ? (
        <p className="requests-message">Chargement...</p>
      ) : error ? (
        <p className="requests-message error">{error}</p>
      ) : requests.length === 0 ? (
        <p className="requests-message">Aucune demande récente.</p>
      ) : (
        <table className="recent-requests-table">
          <thead>
            <tr>
              <th>GROUPE</th>
              <th>DATE</th>
              <th>STATUT</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.blood_type}</td>
                <td>{formatDate(request.created_at)}</td>
                <td>
                  <span className={getStatusClass(request.status)}>
                    {getStatusLabel(request.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}