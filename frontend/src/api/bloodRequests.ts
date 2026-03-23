/**
 * ============================================================
 * API - Blood Requests
 * ------------------------------------------------------------
 * Ce fichier contient les fonctions permettant d’appeler
 * le backend pour récupérer les demandes de sang.
 *
 * Fonction principale :
 * - fetchRecentBloodRequests : récupère les 5 dernières
 *   demandes d’un hôpital en envoyant son identifiant
 *   directement dans l’URL.
 * ============================================================
 */

import type { RecentBloodRequestsResponse } from "../types/bloodRequest";

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