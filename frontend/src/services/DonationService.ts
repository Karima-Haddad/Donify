import axios from "axios";
 
const API_URL = "http://localhost:4000/api/donations";
 
// ── Types ─────────────────────────────────────────────────────────────────
export interface DonationRecord {
  id:                   string;
  donation_date:        string | null;
  validated_by_hospital: boolean;
  volume_ml:            number | null;
  created_at:           string;
  hospital_name:        string | null;
  city:                 string | null;
  blood_type:           string | null;
}
 
export interface DonationHistoryResponse {
  donations: DonationRecord[];
  total:     number;
}
 
// ── Headers avec token JWT ────────────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};
 
// ── Récupérer l'historique des dons du donneur connecté ───────────────────
export const getMyDonations = async (): Promise<DonationHistoryResponse> => {
  const res = await axios.get(`${API_URL}/my`, getAuthHeaders());
  return res.data;
};