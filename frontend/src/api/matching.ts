import { http } from "./http";
import type { Donor,ValidatedDonation  } from "../types/matching";

interface FetchTopKParams {
  blood_type: string;
  k?: number;
  request_id: string;
}

/**
 * Appelle l’API backend pour récupérer les donneurs classés
 * par probabilité d’acceptation.
 */

export async function fetchTopKDonors({
  blood_type,
  k = 100,
  request_id,
}: FetchTopKParams): Promise<Donor[]> {
  try {
    const response = await http.post<Donor[]>("/api/matching/topk", {
      blood_type,
      k,
      request_id,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch Top-K donors:", error);
    throw error; 
  }
}


/**
 * Appelle l’API backend pour valider une donation.
 */
export async function validateDonation(data: {
  donor_id: string;
  request_id: string;
  volume_ml: number;
}) {
  try {
    const response = await http.post("/api/matching/validate-donation", data);
    return response.data;
  } catch (error) {
    console.error("Failed to validate donation:", error);
    throw error;
  }
}

/**
 * Appelle l’API backend pour récupérer les dons validés pour une demande donnée.
 */
export async function fetchValidatedDonations(
  requestId: string
): Promise<ValidatedDonation[]> {
  try {
    const response = await http.get<ValidatedDonation[]>(
      `/api/matching/validated-donations/${requestId}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch validated donations:", error);
    throw error;
  }
}