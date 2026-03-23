/**
 * Controller du dashboard hôpital
 * Ce fichier gère les requêtes HTTP entrantes,
 * appelle le service métier et renvoie la réponse au client.
 */

import { getHospitalDashboardService } from "../src/services/hospitalDashboardService.js";

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