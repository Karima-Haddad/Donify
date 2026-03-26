// src/services/bloodRequestService.ts
import axios from "axios";

const API_URL = "http://localhost:4000/api/blood-requests";

export interface BloodRequestPayload {
  blood_type: string;
  quantity: number;
}

export interface BloodRequestResponse {
  id: string;
  hospital_id: string;
  blood_type: string;
  quantity: number;
  urgency_level: null;
  status: string;
  location_id: string;
  created_at: string;
}

// Récupère le token depuis localStorage et l'ajoute dans les headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};

export const createBloodRequest = async (
  data: BloodRequestPayload
): Promise<BloodRequestResponse> => {
  const res = await axios.post(`${API_URL}/create`, data, getAuthHeaders());
  return res.data.data;
};