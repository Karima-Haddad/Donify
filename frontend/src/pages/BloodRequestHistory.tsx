// src/pages/BloodRequestHistory.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBloodRequests, type BloodRequestResponse } from "../services/bloodRequestService";
import "../styles/BloodRequestHistory.css";

export default function BloodRequestHistory() {
  const [requests, setRequests]   = useState<BloodRequestResponse[]>([]);
  const [filtered, setFiltered]   = useState<BloodRequestResponse[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate]     = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyBloodRequests();
        setRequests(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...requests];
    if (filterStatus !== "all") {
      result = result.filter(r => r.status === filterStatus);
    }
    if (filterDate) {
      result = result.filter(r => r.created_at.startsWith(filterDate));
    }
    setFiltered(result);
  }, [filterStatus, filterDate, requests]);

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":        return <span className="bh-badge bh-open">Active</span>;
      case "in_progress": return <span className="bh-badge bh-progress">En cours</span>;
      case "satisfied":   return <span className="bh-badge bh-satisfied">Clôturée</span>;
      default:            return <span className="bh-badge">{status}</span>;
    }
  };

  return (
    <div className="bh-wrapper">
      <div className="bh-container">

        {/* Header : titre à gauche, bouton à droite */}
        <div className="bh-header">
          <div>
            <h1>Mes demandes de sang</h1>
            <p>Historique de toutes vos demandes publiées sur Donify.</p>
          </div>
          <button
            className="bh-btn-primary"
            onClick={() => navigate("/create-request")}
          >
            <i className="fas fa-plus"></i> Nouvelle demande
          </button>
        </div>

        {/* Filtres : select + input à gauche, réinitialiser tout à droite */}
        <div className="bh-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Toutes les demandes</option>
            <option value="open">Actives</option>
            <option value="in_progress">En cours</option>
            <option value="satisfied">Clôturées</option>
          </select>

          <input
            type="month"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Filtrer par mois"
          />

          {(filterStatus !== "all" || filterDate) && (
            <button
              className="bh-btn-reset"
              onClick={() => { setFilterStatus("all"); setFilterDate(""); }}
            >
              <i className="fas fa-times"></i> Réinitialiser
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bh-table-card">
          {loading ? (
            <div className="bh-loading">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="bh-empty">
              <i className="fas fa-inbox"></i>
              <p>Aucune demande trouvée.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Groupe sanguin</th>
                  <th>Quantité</th>
                  <th>Date de création</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.blood_type}</strong></td>
                    <td>{r.quantity} poche{r.quantity > 1 ? "s" : ""}</td>
                    <td>{formatDate(r.created_at)}</td>
                    <td>{r.service || "—"}</td>
                    <td>{getStatusBadge(r.status)}</td>
                    <td>
                      <button
                        className="bh-btn-view"
                        onClick={() => navigate(`/blood-request/${r.id}`)}
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}