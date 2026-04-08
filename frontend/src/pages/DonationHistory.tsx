// src/pages/DonationHistory.tsx
import { useState, useEffect } from "react";
import { getMyDonations, type DonationRecord } from "../services/DonationService";
import "../styles/DonationHistory.css";

export default function DonationHistory() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [total, setTotal]         = useState<number>(0);
  const [loading, setLoading]     = useState<boolean>(true);

  // ── Charger les dons au montage ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyDonations();
        setDonations(data.donations);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Formater la date ───────────────────────────────────────────────────
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="dh-wrapper">

      {/* Page Header */}
      <div className="dh-page-header">
        <h1>Historique des dons</h1>
        <p>Votre parcours de solidarité – chaque don compte et sauve des vies.</p>
      </div>

      <div className="dh-container">

        {/* Summary */}
        <div className="dh-summary">
          <div className="dh-summary-label">Total des dons effectués</div>
          <div className="dh-summary-count">{loading ? "..." : total}</div>
        </div>

        {/* Table */}
        <div className="dh-table-container">
          {loading ? (
            <div className="dh-loading">Chargement...</div>
          ) : donations.length === 0 ? (
            <div className="dh-empty">
              <i className="fas fa-heartbeat"></i>
              <p>Vous n'avez pas encore effectué de don.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hôpital</th>
                  <th>Groupe sanguin</th>
                  <th>Ville</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td data-label="Date">{formatDate(d.donation_date)}</td>
                    <td data-label="Hôpital">{d.hospital_name || "—"}</td>
                    <td data-label="Groupe sanguin"><strong>{d.blood_type || "—"}</strong></td>
                    <td data-label="Ville">{d.city || "—"}</td>
                    <td data-label="Statut">
                      <span className={`dh-status ${d.validated_by_hospital ? "dh-validated" : "dh-pending"}`}>
                        {d.validated_by_hospital ? "Validé" : "En attente"}
                      </span>
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