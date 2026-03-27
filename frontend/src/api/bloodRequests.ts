/**
 * Ce fichier contient les fonctions permettant d’appeler
 * le backend pour récupérer les demandes de sang.
 *
 * Fonctions principales :
 * - fetchRecentBloodRequests : récupère les 5 dernières demandes d’un hôpital en envoyant son identifiant
 * - fetchBloodRequestById : récupère une demande par son ID
 * ============================================================
 */

import type { RecentBloodRequestsResponse } from "../types/bloodRequest";
import { http } from "./http";
import type { CloseBloodRequestResponse } from "../types/bloodRequest";

export async function fetchRecentBloodRequests(hospitalId: string) {
  const response = await fetch(
    `http://localhost:4000/api/blood-requests/recent/${hospitalId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || "Erreur API");
  }

  const data: RecentBloodRequestsResponse = await response.json();
  return data.data;

}


const API_URL = import.meta.env.VITE_API_URL;

export async function fetchBloodRequestById(requestId: string) {
  const response = await http.get(
    `${API_URL}/api/blood-requests/${requestId}`
  );

  return response.data.data;
}


/**
 * Clôture une demande de sang via son identifiant.
 */
export async function closeBloodRequest(
  requestId: string
  ): Promise<CloseBloodRequestResponse> {
    const response = await http.patch(`/api/blood-requests/${requestId}/close`);
    return response.data;
  }