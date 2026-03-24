/**
 * Service du dashboard hôpital
 * Ce fichier contient la logique métier.
 * Il agit comme intermédiaire entre le controller et le repository.
 */

import { getHospitalDashboardRepository } from "../../repositories/hospitalDashboardRepository.js";

export async function getHospitalDashboardService(hospitalId) {
  // Pour l’instant, on délègue directement au repositor y
  return await getHospitalDashboardRepository(hospitalId);
}