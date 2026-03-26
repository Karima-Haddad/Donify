import "../styles/donor.css";
import { useEffect, useState } from "react";
import { getDonorDashboard } from "../services/dashboardService";

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

function DonorDashboard() {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total_donations: 0,
    active_requests: 0,
    reliability_score: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 récupérer le vrai ID depuis le login
  const donorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!donorId) {
        console.error("Aucun userId trouvé");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getDonorDashboard(donorId);

        console.log("DATA DASHBOARD :", data); // 🔥 debug

        // 🩸 Donor
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

        // 📊 Stats
        if (data?.stats) {
          setStats({
            total_donations: Number(data.stats.total_donations) || 0,
            active_requests: Number(data.stats.active_requests) || 0,
            reliability_score: Number(data.stats.reliability_score) || 0,
          });
        }

        // 📋 Requests
        const rawRequests = data?.recent_requests || data?.responses || [];

        const mapped: RecentRequest[] = rawRequests.slice(0, 5).map((item: any, index: number) => ({
          id: item.id || `${index}`,
          hospital_name: item.hospital_name || "Hôpital inconnu",
          blood_type: item.blood_type || "A+",
          date: item.date || item.sent_at || item.created_at || "",
          status:
            item.status === "confirmed" || item.response_status === "accepted"
              ? "confirmed"
              : item.status === "pending" || item.response_status === "no_response"
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

  // 🔄 Loading
  if (loading) return <div>Chargement...</div>;

  // ❌ Aucun utilisateur
  if (!donor) return <div>Erreur : donor introuvable</div>;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Bonjour, {donor.name} 👋</h1>
          <p>Merci d’être une héroïne du quotidien 🩸</p>
        </div>
        <span className="badge">
          {donor.availability ? "Disponible" : "Indisponible"}
        </span>
      </div>

      <div className="stats">
        <div className="card">
          <h3>Total des dons</h3>
          <div className="value">{stats.total_donations}</div>
        </div>

        <div className="card">
          <h3>Demandes actives</h3>
          <div className="value">{stats.active_requests}</div>
        </div>

        <div className="card">
          <h3>Score fiabilité</h3>
          <div className="value">{stats.reliability_score}%</div>
        </div>
      </div>

      <div className="eligibility">
        <h2>Prochaine éligibilité</h2>
        <p>
          À partir du{" "}
          <strong>{formatDate(donor.next_eligible_date)}</strong>
        </p>
      </div>

      <div className="profile-summary">
        <h2>Mes informations</h2>
        <p>Email : {donor.email}</p>
        <p>Téléphone : {donor.contact_phone || "Non renseigné"}</p>
        <p>
          Lieu : {donor.location_city || "-"}{" "}
          {donor.location_governorate || ""}
        </p>
        <p>
          Dernier don : {formatDate(donor.last_donation_date)}
        </p>
      </div>

      <div className="table-section">
        <h2>Dernières demandes</h2>

        <table>
          <thead>
            <tr>
              <th>Hôpital</th>
              <th>Groupe</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {recentRequests.length === 0 ? (
              <tr>
                <td colSpan={4}>Aucune demande</td>
              </tr>
            ) : (
              recentRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.hospital_name}</td>
                  <td>{req.blood_type}</td>
                  <td>{formatDate(req.date)}</td>
                  <td>
                    {req.status === "confirmed"
                      ? "Confirmée"
                      : "En attente"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonorDashboard;


