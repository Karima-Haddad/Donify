import "../styles/hospital.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Pencil,
  ClipboardList,
  CheckCircle2,
  CalendarDays,
  Activity,
  Droplets,
  Percent,
} from "lucide-react";
import { getHospitalProfil } from "../services/profilService";

type Hospital = {
  id: string;
  public_id?: string;
  name: string;
  email: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
  city?: string;
  governorate?: string;
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

type Stats = {
  total_requests: number;
  active_requests: number;
  validated_donations: number;
  response_rate: number;
  critical_stock: {
    blood_type: string | null;
    current_stock_bags: number;
  };
};

function HospitalProfil() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [, setRequests] = useState<RequestStat[]>([]);
  const [, setNotifications] = useState<NotificationData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
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
        setStats(data.stats ?? null);
      } catch (err) {
        console.error("Erreur hospital profil :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);


  if (loading) {
    return (
      <div className="hospital-profile-container">
        <div className="status-message">Chargement...</div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="hospital-profile-container">
        <div className="status-message error">
          Erreur : hôpital introuvable
        </div>
      </div>
    );
  }

  return (
    <div className="hospital-profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-header-left">
          <div className="hospital-icon">
            <Building2 size={30} strokeWidth={2.2} />
          </div>

          <div>
            <h1>{hospital.name}</h1>
          </div>
        </div>

        <div className="profile-header-actions">
          

          <button
            className="btn-outline"
            onClick={() => navigate("/hospital-profile-edit")}
          >
            <Pencil size={18} strokeWidth={2.2} />
            Modifier Profil
          </button>
        </div>
      </div>

      {/* INFORMATIONS GÉNÉRALES */}
      <div className="card-hospital">
        <h2>Informations générales</h2>

        <div className="info-grid">
         <div className="info-item">
            <span>ID public</span>
            <strong>{hospital.public_id || "—"}</strong>
          </div>

          <div className="info-item">
            <span>Email</span>
            <strong>{hospital.email}</strong>
          </div>

          <div className="info-item">
            <span>Téléphone</span>
            <strong>{hospital.contact_phone || "—"}</strong>
          </div>

          

          <div className="info-item">
            <span>Adresse</span>
            <strong>{hospital.governorate || "—"} - {hospital.city || "—"}</strong>
          </div>

          
        </div>
      </div>

      {/* STATISTIQUES */}
      <div className="card-hospital">
        <h2>Statistiques globales</h2>

        <div className="stats">
          <div className="stat-card">
            <div className="icon">
              <ClipboardList size={22} strokeWidth={2.2} />
            </div>
            <h3>Demandes publiées</h3>
            <div className="value">{stats?.total_requests ?? 0}</div>
          </div>

          <div className="stat-card">
            <div className="icon">
              <Activity size={22} strokeWidth={2.2} />
            </div>
            <h3>Demandes actives</h3>
            <div className="value">{stats?.active_requests ?? 0}</div>
          </div>

          <div className="stat-card">
            <div className="icon">
              <CheckCircle2 size={22} strokeWidth={2.2} />
            </div>
            <h3>Dons validés</h3>
            <div className="value">{stats?.validated_donations ?? 0}</div>
          </div>

          <div className="stat-card">
            <div className="icon">
              <Percent size={22} strokeWidth={2.2} />
            </div>
            <h3>Taux de réponse</h3>
            <div className="value">{stats?.response_rate ?? 0}%</div>
          </div>

          <div className="stat-card">
            <div className="icon">
              <Droplets size={22} strokeWidth={2.2} />
            </div>
            <h3>Stock critique</h3>
            <div className="value">
              {stats?.critical_stock?.blood_type || "—"}
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">
              <CalendarDays size={22} strokeWidth={2.2} />
            </div>
            <h3>Membre depuis</h3>
            <div className="value">
              {hospital.created_at
                ? new Date(hospital.created_at).getFullYear()
                : "—"}
            </div>
          </div>
        </div>
      </div>

                
    </div>
  );
}

export default HospitalProfil;