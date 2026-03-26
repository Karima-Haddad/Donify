// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

// ── Types des payloads ────────────────────────────────────────────────────

export interface DonorPayload {
  name: string;
  email: string;
  password: string;
  contact_phone: string;
  gender: string;
  date_of_birth: string;
  blood_type: string;
  availability: boolean;
  city: string;
  governorate: string;
  latitude: number | null;
  longitude: number | null;
  last_donation_date: string | null;
  next_eligible_date: string | null;
}

export interface HospitalPayload {
  name: string;
  email: string;
  password: string;
  contact_phone: string;
  city: string;
  governorate: string;
  latitude: number | null;
  longitude: number | null;
}

// ── Fonctions API ─────────────────────────────────────────────────────────

export const registerDonor = async (data: DonorPayload) => {
  const res = await axios.post(`${API_URL}/register/donor`, data);
  return res.data;
};

export const registerHospital = async (data: HospitalPayload) => {
  const res = await axios.post(`${API_URL}/register/hospital`, data);
  return res.data;
};