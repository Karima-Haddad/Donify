import axios from "axios";

const API_URL = "http://localhost:4000/api";

export type DonorDashboard = {
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

export const getDonorDashboard = async (donorId: string): Promise<DonorDashboard> => {
  const res = await axios.get(`${API_URL}/donor/${donorId}/dashboard`);
  return res.data;
};

export type HospitalDashboard = {
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

export const getHospitalDashboard = async (hospitalId: string): Promise<HospitalDashboard> => {
  const res = await axios.get(`${API_URL}/hospital/${hospitalId}/dashboard`);
  return res.data;
};
