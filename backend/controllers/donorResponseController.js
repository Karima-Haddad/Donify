/**
 * Contrôleur API pour gérer la réponse d’un donneur :
 * reçoit la requête HTTP, appelle le service métier,
 * puis retourne une réponse JSON standardisée au client.
 */

import { respondToRequestService } from "../src/services/donorResponseService.js";

export async function respondToRequestController(req, res) {
  try {
    const result = await respondToRequestService(req.body);

    return res.status(201).json({
      success: true,
      message: "Réponse du donneur enregistrée avec succès",
      data: result,
    });
  } catch (error) {
    console.error("Erreur respondToRequestController :", error);

    if (
      error.message === "request_id est obligatoire" ||
      error.message === "donor_id est obligatoire" ||
      error.message === "response_status est obligatoire" ||
      error.message === "response_status invalide"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Blood request not found" ||
      error.message === "Donor not found" ||
      error.message === "Notification not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "This notification has already been answered") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Erreur interne du serveur",
    });
  }
}