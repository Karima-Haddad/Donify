import axios from "axios";

const API_URL = "http://localhost:4000/api";

// ✅ Donor Dashboard
export const getDonorDashboard = async (donorId) => {
  const res = await axios.get(`${API_URL}/donor/${donorId}/dashboard`);
  return res.data;
};

// ✅ Hospital Dashboard
export const getHospitalDashboard = async (hospitalId) => {
  const res = await axios.get(`${API_URL}/hospital/${hospitalId}/dashboard`);
  return res.data;
};
