import { http } from "./http";
import type { Donor } from "../types/matching";

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