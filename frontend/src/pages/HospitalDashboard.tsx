import { useNavigate } from "react-router-dom";

function HospitalDashboard() {
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard Hôpital</h1>
      <p>Bienvenue 👋</p>
      <p>Rôle : {userRole}</p>

      <button
        onClick={() => navigate("/create-request")}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          background: "#A2211B",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        🩸 Créer une demande de sang
      </button>
import "../styles/hospital.css";
import { useEffect, useState } from "react";
import { getHospitalDashboard } from "../services/dashboardService";

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

function HospitalDashboard() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [requests, setRequests] = useState<RequestStat[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Récupération dynamique de l'ID depuis le login
  const hospitalId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!hospitalId) {
        console.error("Aucun userId trouvé dans localStorage !");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getHospitalDashboard(hospitalId);
        console.log("HOSPITAL DATA :", data); // debug

        setHospital(data.hospital ?? null);
        setRequests(data.requests ?? []);
        setNotifications(data.notifications ?? []);
      } catch (err) {
        console.error("Erreur hospital dashboard :", err);
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
  const memberSince = hospital ? new Date().getFullYear() : new Date().getFullYear();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
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
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span className="badge">Compte Actif</span>
          <button className="btn-outline">
            <i className="fas fa-edit"></i> Modifier Profil
          </button>
        </div>
      </div>

      {/* INFORMATIONS GENERALES */}
      <div className="card">
        <h2>Informations générales</h2>
        <div className="info-grid">
          <div className="info-item">
            <span>Responsable</span>
            <strong>—</strong>
          </div>
          <div className="info-item">
            <span>Email</span>
            <strong>{hospital.email}</strong>
          </div>
          <div className="info-item">
            <span>Téléphone</span>
            <strong>—</strong>
          </div>
          <div className="info-item">
            <span>Adresse</span>
            <strong>—</strong>
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

export default HospitalDashboard;