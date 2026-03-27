/*
 * Ce controller gère les opérations liées aux demandes de sang.
 */

import * as bloodRequestService from "../src/services/bloodRequestService.js";
import { fetchRecentBloodRequests, closeBloodRequest } from "../src/services/bloodRequestService.js"
import { findBloodRequestById } from "../repositories/bloodRequestRepository.js";
import pool from "../config/database.js";


// ── Créer une demande de sang ─────────────────────────────────────────────
export async function createBloodRequest(req, res, next) {
  try {
    const hospital_id = req.user?.id; // ou req.body.hospital_id
    const data = req.body;

    if (!hospital_id) {
      return res.status(401).json({
        success: false,
        message: "Hôpital non authentifié",
      });
    }

    const result = await bloodRequestService.createBloodRequest(
      hospital_id,
      data
    );

    return res.status(201).json({
      success: true,
      bloodRequest: result.bloodRequest,
      notifiedDonorsCount: result.notifiedDonorsCount,
    });
  } catch (error) {
    next(error);
  }
}


// ── Récupérer les demandes de l'hôpital connecté ─────────────────────────
export const getMyBloodRequests = async (req, res) => {
  try {
    const hospital_id = req.user.id;

    if (req.user.role !== "hospital") {
      return res.status(403).json({
        error: "Accès refusé."
      });
    }

    const requests = await bloodRequestService.getBloodRequestsByHospital(hospital_id);
    res.status(200).json(requests);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// ── Récupérer une demande par ID ──────────────────────────────────────────
export const getBloodRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await bloodRequestService.getBloodRequestById(id);
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    if (err.message.includes("introuvable")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};


















/*================================================================================================================================
KARIMA 
================================================================================================================================*/

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



export async function getMyBloodRequestById(req, res) {
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


