/**
 * Service du dashboard hôpital
 * Ce fichier contient la logique métier.
 * Il agit comme intermédiaire entre le controller et le repository.
 */

import { getHospitalProfilRepository } from "../../repositories/hospitalProfilRepository.js";
import { updateHospitalProfilRepository } from "../../repositories/hospitalProfilRepository.js";
export async function getHospitalProfilService(hospitalId) {
  // Pour l’instant, on délègue directement au repository
  return await getHospitalProfilRepository(hospitalId);
}


export async function updateHospitalProfilService(hospitalId, data) {
  return await updateHospitalProfilRepository(hospitalId, data);
}