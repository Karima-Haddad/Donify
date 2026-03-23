import { getRecentBloodRequestsByHospital } from "../../repositories/RecentBloodRequestsRepository.js";

export async function fetchRecentBloodRequests(hospitalId) {
  if (!hospitalId) {
    const error = new Error("hospitalId est requis");
    error.statusCode = 400;
    throw error;
  }

  return await getRecentBloodRequestsByHospital(hospitalId);
}