import "../styles/donor.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDonorProfil } from "../services/profilService";

type Donor = {
  id: string;
  name: string;
  email: string;
  contact_phone?: string;
  blood_type: string;
  availability: boolean;
  gender?: string;
  last_donation_date?: string;
  next_eligible_date?: string;
  location_city?: string;
  location_governorate?: string;
};

type DashboardStats = {
  total_donations: number;
  active_requests: number;
  reliability_score: number;
};

type RecentRequest = {
  id: string;
  hospital_name: string;
  blood_type: string;
  date: string;
  status: "pending" | "confirmed" | "other";
};

function DonorProfil() {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total_donations: 0,
    active_requests: 0,
    reliability_score: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const donorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!donorId) {
        console.error("Aucun userId trouvé");
        setLoading(false);
        return;
      }

      try {
        const data = await getDonorProfil(donorId);

        if (data?.donor) {
          setDonor({
            id: data.donor.id,
            name: data.donor.name,
            email: data.donor.email,
            contact_phone: data.donor.contact_phone,
            blood_type: data.donor.blood_type,
            availability: data.donor.availability ?? true,
            gender: data.donor.gender,
            last_donation_date: data.donor.last_donation_date,
            next_eligible_date: data.donor.next_eligible_date,
            location_city: data.donor.location?.city,
            location_governorate: data.donor.location?.governorate,
          });
        }

        if (data?.stats) {
          setStats({
            total_donations: Number(data.stats.total_donations) || 0,
            active_requests: Number(data.stats.active_requests) || 0,
            reliability_score: Number(data.stats.reliability_score) || 0,
          });
        }

        const rawRequests = data?.recent_requests || data?.responses || [];

        const mapped: RecentRequest[] = rawRequests
          .slice(0, 5)
          .map((item: any, index: number) => ({
            id: item.id || `${index}`,
            hospital_name: item.hospital_name || "Hôpital inconnu",
            blood_type: item.blood_type || "A+",
            date: item.date || item.sent_at || item.created_at || "",
            status:
              item.status === "confirmed" ||
              item.response_status === "accepted"
                ? "confirmed"
                : item.status === "pending" ||
                  item.response_status === "no_response"
                ? "pending"
                : "other",
          }));

        setRecentRequests(mapped);
      } catch (error) {
        console.error("Erreur DonorDashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [donorId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Non défini";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <div>Chargement...</div>;
  if (!donor) return <div>Erreur : donor introuvable</div>;

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>Bonjour, {donor.name} 👋</h1>
          <p>Merci d’être une héroïne du quotidien 🩸</p>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <span className="badge">
            {donor.availability ? "Disponible" : "Indisponible"}
          </span>

          <button
            className="btn-outline"
            onClick={() => navigate("/donor-profil/edit")}
          >
            Modifier Profil
          </button>
        </div>
      </div>

      {/* INFOS DONNEUR */}
      <div className="card">
        <h2>Informations personnelles</h2>
        <p><strong>Email :</strong> {donor.email}</p>
        <p><strong>Téléphone :</strong> {donor.contact_phone || "Non défini"}</p>
        <p><strong>Groupe sanguin :</strong> {donor.blood_type}</p>
        <p><strong>Genre :</strong> {donor.gender || "Non défini"}</p>
        <p>
          <strong>Localisation :</strong>{" "}
          {donor.location_city || "-"}, {donor.location_governorate || "-"}
        </p>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <h3>Dons effectués</h3>
          <p>{stats.total_donations}</p>
        </div>

        <div className="stat-card">
          <h3>Demandes actives</h3>
          <p>{stats.active_requests}</p>
        </div>

        <div className="stat-card">
          <h3>Score fiabilité</h3>
          <p>{stats.reliability_score}%</p>
        </div>
      </div>

      {/* DATES */}
      <div className="card">
        <h2>Suivi des dons</h2>
        <p>
          <strong>Dernier don :</strong>{" "}
          {formatDate(donor.last_donation_date)}
        </p>
        <p>
          <strong>Prochain don possible :</strong>{" "}
          {formatDate(donor.next_eligible_date)}
        </p>
      </div>

      {/* DEMANDES RECENTES */}
      <div className="card">
        <h2>Demandes récentes</h2>

        {recentRequests.length === 0 ? (
          <p>Aucune demande récente</p>
        ) : (
          <ul className="request-list">
            {recentRequests.map((req) => (
              <li key={req.id} className="request-item">
                <div>
                  <strong>{req.hospital_name}</strong> — {req.blood_type}
                </div>
                <div>{formatDate(req.date)}</div>
                <div className={`status ${req.status}`}>
                  {req.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DonorProfil;
