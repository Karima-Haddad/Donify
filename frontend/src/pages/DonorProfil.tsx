import "../styles/donor.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDonorProfil } from "../services/profilService";
import {
  FaTint,
  FaHeartbeat,
  FaHospital,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

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
  const [, setRecentRequests] = useState<RecentRequest[]>([]);
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

        const mapped: RecentRequest[] = rawRequests.slice(0, 5).map((item: any, index: number) => ({
          id: item.id || `${index}`,
          hospital_name: item.hospital_name || "Hôpital inconnu",
          blood_type: item.blood_type || "A+",
          date: item.date || item.sent_at || item.created_at || "",
          status:
            item.response_status === "accepted"
              ? "confirmed"
              : item.response_status === "no_response"
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

  if (loading) return <div className="container">Chargement...</div>;
  if (!donor) return <div className="container">Erreur : donneur introuvable</div>;

  return (
    <div className="container-donor">
      <div className="header fade-in delay-1">
        <div>
          <h1>Bonjour, {donor.name}</h1>
          <p>Merci d’être une héroïne du quotidien 🩸</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            alignItems: "center", 
            flexWrap: "nowrap",
          }}
        >
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

      <div className="info-card fade-in delay-2">
        <h2>
          <FaUser /> Informations personnelles
        </h2>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">
              <FaEnvelope /> Email
            </div>
            <div className="info-value">{donor.email}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <FaPhoneAlt /> Téléphone
            </div>
            <div className="info-value">
              {donor.contact_phone || "Non défini"}
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <FaTint /> Groupe sanguin
            </div>
            <div className="info-value">{donor.blood_type}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <FaUser /> Genre
            </div>
            <div className="info-value">{donor.gender || "Non défini"}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <FaMapMarkerAlt /> Adresse
            </div>
            <div className="info-value">
              {donor.location_city || "-"}, {donor.location_governorate || "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="stats-donor fade-in delay-3">
        <div className="stat-card-donor">
          <div className="stat-icon-donor">
            <FaTint />
          </div>
          <h3>Dons effectués</h3>
          <p>{stats.total_donations}</p>
        </div>

        <div className="stat-card-donor">
          <div className="stat-icon-donor">
            <FaHospital />
          </div>
          <h3>Demandes actives</h3>
          <p>{stats.active_requests}</p>
        </div>

        <div className="stat-card-donor">
          <div className="stat-icon-donor">
            <FaHeartbeat />
          </div>
          <h3>Score fiabilité</h3>
          <p>{stats.reliability_score}%</p>
        </div>
      </div>

      <div className="card-donor fade-in delay-4">
        <h2>
          <FaCalendarAlt /> Suivi des dons
        </h2>

        <div className="timeline-grid">
          <div className="timeline-box">
            <div className="timeline-title">
              <FaCalendarAlt /> Dernier don
            </div>
            <div className="timeline-value">
              {formatDate(donor.last_donation_date)}
            </div>
          </div>

          <div className="timeline-box">
            <div className="timeline-title">
              <FaCheckCircle /> Prochain don possible
            </div>
            <div className="timeline-value">
              {formatDate(donor.next_eligible_date)}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default DonorProfil;