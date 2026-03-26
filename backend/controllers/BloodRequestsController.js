/*
 * Ce controller gère les opérations liées aux demandes de sang.
 */
import { fetchRecentBloodRequests, closeBloodRequest,createBloodRequestWithNotifications } from "../src/services/BloodRequestsService.js";
import { findBloodRequestById } from "../repositories/BloodRequestsRepository.js";


/**
 * récupère l'identifiant de l'hôpital depuis l'URL
 * puis retourne les 5 dernières demandes de sang associées.
 */

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



export async function getBloodRequestById(req, res) {
  try {
    const { requestId } = req.params;

    const request = await findBloodRequestById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Erreur getBloodRequestById:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}

export async function closeBloodRequestController(req, res, next) {
  try {
    const { requestId } = req.params;

    const updatedRequest = await closeBloodRequest(requestId);

    return res.status(200).json({
      success: true,
      message: "La demande a été clôturée avec succès.",
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
}


export async function createBloodRequest(req, res, next) {
  try {
    const { hospital_id, blood_type, quantity, urgency_level, location_id } = req.body;

    const result = await createBloodRequestWithNotifications({
      hospital_id,
      blood_type,
      quantity,
      urgency_level,
      location_id,
    });

    res.status(201).json({
      success: true,
      bloodRequest: result.bloodRequest,
      notifiedDonorsCount: result.notifiedDonorsCount,
    });
  } catch (error) {
    next(error);
  }
}

