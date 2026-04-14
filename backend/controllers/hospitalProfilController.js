/**
 * Controller du dashboard hôpital
 * Ce fichier gère les requêtes HTTP entrantes,
 * appelle le service métier et renvoie la réponse au client.
 */

import { getHospitalProfilService } from "../src/services/hospitalProfilService.js";
import { updateHospitalProfilService } from "../src/services/hospitalProfilService.js";
import { getHospitalDashboardService } from "../src/services/hospitalProfilService.js";


export async function getHospitalProfilController(req, res, next) {
  try {
    const { hospitalId } = req.params;

    // Appel du service pour récupérer les données du profil
    const profil = await getHospitalProfilService(hospitalId);

    // Réponse envoyée au frontend
    res.status(200).json(profil);
  } catch (error) {
    next(error);
  }
}

export async function updateHospitalProfilController(req, res, next) {
  try {
    const { hospitalId } = req.params; // 👈 AU LIEU DE id
    const data = req.body;

    const updated = await updateHospitalProfilService(hospitalId, data);

    res.json(updated);
  } catch (err) {
    next(err);
  }
}




export async function getHospitalDashboardController(req, res, next) {
  try {
    const { hospitalId } = req.params;

    // Appel du service pour récupérer les données du dashboard
    const dashboard = await getHospitalDashboardService(hospitalId);

    // Réponse envoyée au frontend
    res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
}