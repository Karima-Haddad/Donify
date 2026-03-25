// backend/controllers/bloodRequestController.js
import * as bloodRequestService from "../src/services/bloodRequestService.js";

// ── Créer une demande de sang ─────────────────────────────────────────────
export const createBloodRequest = async (req, res) => {
  try {
    // hospital_id récupéré depuis le token JWT via authMiddleware
    const hospital_id = req.user.id;

    // Vérifier que c'est bien un hôpital
    if (req.user.role !== "hospital") {
      return res.status(403).json({
        error: "Accès refusé. Seuls les hôpitaux peuvent créer des demandes."
      });
    }

    const { blood_type, quantity } = req.body;

    // Validation basique
    if (!blood_type) {
      return res.status(400).json({ error: "Le groupe sanguin est requis" });
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      return res.status(400).json({ error: "La quantité doit être un nombre positif" });
    }

    const bloodRequest = await bloodRequestService.createBloodRequest(
      hospital_id,
      { blood_type, quantity: Number(quantity) }
    );

    res.status(201).json({
      message: "Demande de sang créée avec succès",
      data: bloodRequest
    });

  } catch (err) {
    console.error(err);

    if (err.message.includes("introuvable") || err.message.includes("non définie")) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

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