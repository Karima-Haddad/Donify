import { healthCheck, getTopKDonors } from "../src/services/matching_model.js";
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

export { getTopK, mlHealth };