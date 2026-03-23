/**
 * API du dashboard hôpital
 * Ce fichier contient les fonctions permettant
 * d'appeler le backend pour récupérer les indicateurs.
 */

import type { HospitalDashboardData } from "../types/dashboard";

export async function fetchHospitalDashboard(
  hospitalId: string
): Promise<HospitalDashboardData> {
  const response = await fetch(
    `http://localhost:4000/api/hospitals/${hospitalId}/dashboard`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du dashboard hôpital");
  }

  return await response.json();
}