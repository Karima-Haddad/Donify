import "../styles/hospital.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHospitalProfil } from "../services/profilService";

type Hospital = {
  id: string;
  name: string;
  email: string;
};

type RequestStat = {
  id: string;
  blood_type: string;
  quantity: number;
  urgency_level?: string;
  status?: string;
  created_at?: string;
};

type NotificationData = {
  id: string;
  message: string;
  status: string;
  sent_at: string;
};

function HospitalProfil() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [requests, setRequests] = useState<RequestStat[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // 🔥 navigation

  const hospitalId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!hospitalId) {
        console.error("Aucun userId trouvé !");
        setLoading(false);
        return;
      }

      try {
        const data = await getHospitalProfil(hospitalId);

        setHospital(data.hospital ?? null);
        setRequests(data.requests ?? []);
        setNotifications(data.notifications ?? []);
      } catch (err) {
        console.error("Erreur hospital profil :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  const requestCount = requests.length;

  const validatedCount = requests.filter(
    (r) => r.status === "satisfied" || r.status === "in_progress"
  ).length;

  const memberSince = new Date().getFullYear();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
  };

  if (loading) return <div>Chargement...</div>;
  if (!hospital) return <div>Erreur : hôpital introuvable</div>;

  return (
    <div className="container">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-header-left">
          <div className="hospital-icon">
            <i className="fas fa-hospital"></i>
          </div>
          <div>
            <h1>{hospital.name}</h1>
            <div className="subtitle">{hospital.email}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <span className="badge">Compte Actif</span>

          {/* 🔥 BOUTON MODIFIER */}
          <button
            className="btn-outline"
            onClick={() => navigate("/hospital-profile-edit")}
          >
            <i className="fas fa-edit"></i> Modifier Profil
          </button>
        </div>
      </div>

      {/* INFOS */}
      <div className="card">
        <h2>Informations générales</h2>
        <div className="info-grid">
          <div className="info-item">
            <span>Email</span>
            <strong>{hospital.email}</strong>
          </div>

          <div className="info-item">
            <span>ID</span>
            <strong>{hospital.id}</strong>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="card">
        <h2>Statistiques globales</h2>

        <div className="stats">
          <div className="stat-card">
            <div className="icon">📋</div>
            <h3>Demandes publiées</h3>
            <div className="value">{requestCount}</div>
          </div>

          <div className="stat-card">
            <div className="icon">✅</div>
            <h3>Dons validés</h3>
            <div className="value">{validatedCount}</div>
          </div>

          <div className="stat-card">
            <div className="icon">📅</div>
            <h3>Membre depuis</h3>
            <div className="value">{memberSince}</div>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="card">
        <h2>Notifications récentes</h2>

        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.slice(0, 5).map((notif) => (
              <li key={notif.id} className={`notification-item ${notif.status}`}>
                <span>{notif.message}</span>
                <small>{formatDate(notif.sent_at)}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune notification</p>
        )}
      </div>
    </div>
  );
}

export default HospitalProfil;
