/**
 * Controller des demandes récentes.
 * Ce fichier récupère l'identifiant de l'hôpital depuis l'URL
 * puis retourne les 5 dernières demandes de sang associées.
 */

import { fetchRecentBloodRequests } from "../src/services/RecentBloodRequestsService.js";

export async function getRecentRequests(req, res, next) {
  try {
    const { hospitalId } = req.params;

    const requests = await fetchRecentBloodRequests(hospitalId);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
}