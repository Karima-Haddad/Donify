import { healthCheck, getTopKDonors, validateDonation, getValidatedDonations } from "../src/services/matching_model.js";
import pool from "../config/database.js";

/**
 * getTopK
 * -------
 * Retourne les Top-K donneurs compatibles selon le blood_type
 * en utilisant le service ML de ranking.
 */

async function getTopK(req, res, next) {
  try {
    const { blood_type, k, request_id } = req.body;

    if (!blood_type) {
      return res.status(400).json({ error: "blood_type is required" });
    }

    if (!request_id) {
      return res.status(400).json({ error: "request_id is required" });
    }


    const result = await getTopKDonors(blood_type, k || 100, request_id);
    res.json(result);

  } catch (err) {
    next(err); 
  }
}


/**
 * mlHealth
 * --------
 * Endpoint de monitoring.
 * Vérifie que le service Machine Learning est opérationnel.
 */

async function mlHealth(req, res) {
  try {
    const status = await healthCheck();
    return res.json(status);
  } catch (err) {
    console.error("mlHealth error:", err.message);
    return res.status(500).json({ error: "ML service unreachable" });
  }
}

/**
 * confirmDonation
 * ---------------
 * Valide une donation après que le donneur ait confirmé son engagement.
 * Crée une entrée dans la table "donations" avec validated_by_hospital = true.
 */
async function confirmDonation(req, res, next) {
  try {
    const { donor_id, request_id, volume_ml } = req.body;

    const result = await validateDonation(donor_id, request_id, volume_ml);

    return res.status(201).json({
      message: "Donation validated successfully",
      donation: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * getValidatedDonationsController
 * -----------------------------
 * Récupère la liste des donations validées pour une demande donnée.
 * Utilisé par l'hôpital pour voir les donneurs qui ont confirmé leur donation.
 */
async function getValidatedDonationsController(req, res, next) {
  try {
    const { requestId } = req.params;

    const donations = await getValidatedDonations(requestId);

    return res.status(200).json(donations);
  } catch (err) {
    next(err);
  }
}

export { getTopK, mlHealth, confirmDonation, getValidatedDonationsController };