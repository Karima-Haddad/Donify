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

export type HospitalProfil = {
  hospital: {
    id: string;
    name: string;
    email: string;
  };
  requests: Array<{
    id: string;
    blood_type: string;
    quantity: number;
    urgency_level?: string;
    status?: string;
    created_at?: string;
  }>;
  notifications: Array<{
    id: string;
    message: string;
    status: string;
    sent_at: string;
  }>;
};

export const getHospitalProfil = async (hospitalId: string): Promise<HospitalProfil> => {
  const res = await axios.get(`${API_URL}/hospitals/${hospitalId}/profil`);
  return res.data;
};



export const updateDonorProfil = async (donorId: string, data: any) => {
  const res = await axios.put(`${API_URL}/donor/${donorId}/profil`, data);
  return res.data;
};


export const updateHospitalProfil = async (hospitalId: string, data: any) => {
  const res = await axios.put(`${API_URL}/hospital/${hospitalId}/profil`, data);
  return res.data;
};
