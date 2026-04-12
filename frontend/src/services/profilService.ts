import axios from "axios";

const API_URL = "http://localhost:4000/api";

export type DonorProfil = {
  donor: {
    id: string;
    name: string;
    email: string;
    contact_phone?: string;
    blood_type: string;
    availability: boolean;
    gender?: string;
    last_donation_date?: string;
    next_eligible_date?: string;
    location?: {
      city?: string;
      governorate?: string;
    };
  };
  stats?: {
    total_donations?: number;
    active_requests?: number;
    reliability_score?: number;
  };
  recent_requests?: Array<{
    id: string;
    hospital_name: string;
    blood_type: string;
    date: string;
    status: string;
  }>;
  responses?: Array<any>;
  notifications?: Array<any>;
};



export const getDonorProfil = async (donorId: string): Promise<DonorProfil> => {
  const res = await axios.get(`${API_URL}/donor/${donorId}/profil`);
  return res.data;
};

// 🔹 TYPES

export type Hospital = {
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

export type RequestStat = {
  id: string;
  blood_type: string;
  quantity: number;
  urgency_level?: string;
  status?: string;
  created_at?: string;
};

export type NotificationData = {
  id: string;
  message: string;
  status: string;
  sent_at: string;
};

export type Stats = {
  total_requests: number;
  active_requests: number;
  validated_donations: number;
  response_rate: number;
  critical_stock: {
    blood_type: string | null;
    current_stock_bags: number;
  };
};

// 🔥 IMPORTANT : ajouter stats ici
export type HospitalProfilResponse = {
  hospital: Hospital;
  requests: RequestStat[];
  notifications: NotificationData[];
  stats: Stats;
};


export async function getHospitalProfil(
  hospitalId: string
): Promise<HospitalProfilResponse> {
  const response = await fetch(
    `http://localhost:4000/api/hospital/profile/${hospitalId}`
  );

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  return await response.json();
}


export const updateDonorProfil = async (donorId: string, data: any) => {
  const res = await axios.put(`${API_URL}/donor/${donorId}/profil`, data);
  return res.data;
};


export const updateHospitalProfil = async (hospitalId: string, data: any) => {
  const res = await axios.put(`${API_URL}/hospital/${hospitalId}/profil`, data);
  return res.data;
};
