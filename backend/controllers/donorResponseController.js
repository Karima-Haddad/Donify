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

    return res.status(500).json({
      success: false,
      message: error.message || "Erreur interne du serveur",
    });
  }
}