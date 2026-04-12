import axios from "axios";

const API_URL = "http://localhost:4000/api";

// ✅ Donor Profil
export const getDonorProfil = async (donorId) => {
  const res = await axios.get(`${API_URL}/donor/${donorId}/profil`);
  return res.data;
};

// ✅ Hospital Profil
export const getHospitalProfil = async (hospitalId) => {
  const res = await axios.get(`${API_URL}/hospitals/${hospitalId}/profil`);
  return res.data;
};

export const updateDonorProfil = async (donorId, updatedData) => {
  const res = await axios.put(`${API_URL}/donor/${donorId}/profil`, updatedData);
  return res.data;
};



export const updateHospitalProfil = async (hospitalId, updatedData) => {
  const res = await axios.put(`${API_URL}/hospitals/${hospitalId}/profil`, updatedData);
  return res.data;
};
