import axios from "axios";
import { env } from "../../config/env.js"; 
import { logger } from "../../config/logger.js";
import pool from "../../config/database.js";
import { findAvailableDonorsByBloodType } from "../../repositories/donor_repository.js"; 
import { findBloodRequestById } from "../../repositories/bloodRequestRepository.js";
import { createValidatedDonation,  getValidatedDonationsByRequestId, } from "../../repositories/donation_repository.js";

// Charger les variables d'environnement
const AI_SERVICE_URL = env.AI_SERVICE_URL;
const INTERNAL_API_KEY = env.INTERNAL_API_KEY;


/**
 * predictTopK
 * -----------
 * Envoie une liste de candidats au service ML
 * et récupère les K meilleurs donneurs classés
 * par probabilité d’acceptation.
 *
 * @param {Array} candidates - Liste des donneurs déjà filtrés 
 * @param {Number} k - Nombre de donneurs à retourner (Top-K)
 * @returns {Object} - Résultat renvoyé par le service ML
 */

async function predictTopK(candidates, k = 100) {

  if (!AI_SERVICE_URL) {
    const err = new Error("AI_SERVICE_URL is not defined in .env");
    err.statusCode = 500;
    throw err;
  }

    if (!INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY not defined in .env");
  }


  const start = Date.now();

  try {
    const { data } = await axios.post(
      `${AI_SERVICE_URL}/predict-topk`,
      {
        candidates, 
        k,       
      },
      {
        headers: {
          "x-api-key": INTERNAL_API_KEY,
        },
        timeout: 15000,
      }
    );
      return data;

    } catch (error) {
        logger.error({
          message: "ML predictTopK failed",
          error_message: error.message,
          error_code: error.code,                 
          status_from_ml: error.response?.status, 
          data_from_ml: error.response?.data,     
          duration_ms: Date.now() - start,
        });

        // Si le ML a répondu (400/422), ce n'est PAS "unavailable"
        if (error.response) {
          const err = new Error(
            error.response.data?.detail
              ? JSON.stringify(error.response.data.detail)
              : "Invalid request sent to ML service"
          );
          err.statusCode = error.response.status; 
          throw err;
        }

        // Sinon (pas de réponse) => vrai problème réseau/timeout
        const err = new Error("ML service unavailable");
        err.statusCode = 503;
        throw err;
    }
}

/**
 * getTopKDonors
 * --------------
 * Récupère les donneurs disponibles compatibles,
 * appelle le service ML et retourne les Top-K
 * classés par probabilité d’acceptation.
 */
export async function getTopKDonors(bloodType, k = 100, requestId) {
  //  Vérifier les paramètres minimums
  if (!bloodType) {
    const err = new Error("bloodType is required");
    err.statusCode = 400;
    throw err;
  }

  if (!requestId) {
    const err = new Error("request_id is required to compute distance_km");
    err.statusCode = 400;
    throw err;
  }

  // Vérifier que la demande existe
  const bloodRequest = await findBloodRequestById(requestId);

  if (!bloodRequest) {
    const err = new Error("Blood request not found");
    err.statusCode = 404;
    throw err;
  }

  // 2) Bloquer si la demande est clôturée
  const closedStatuses = ["satisfied", "expired"];

  if (closedStatuses.includes(bloodRequest.status)) {
    const err = new Error("This blood request is closed. Matching unavailable.");
    err.statusCode = 409;
    throw err;
  }

  // Récupérer les candidats 
  const donors = await findAvailableDonorsByBloodType(bloodType, requestId);

  if (!donors.length) return [];

  // Appeler le service ML pour classer et retourner Top-K
  const topK = await predictTopK(donors, k);

  // Récupérer uniquement les champs nécessaires
  const donorIds = topK.map(d => d.id);

  const { rows } = await pool.query(
    `
    SELECT 
      u.id,
      u.public_id,
      d.gender,
      d.blood_type,
      contact_phone,
      EXTRACT(YEAR FROM AGE(d.date_of_birth)) AS age
    FROM users u
    JOIN donors d ON d.id = u.id
    WHERE u.id = ANY($1)
    `,
    [donorIds]
  );

  // Construire map id → infos affichage
  const infoMap = {};
  rows.forEach(row => {
    infoMap[row.id] = row;
  });

  // Construire réponse finale PROPRE
  const finalResults = topK.map(d => ({
    donor_id: d.id,
    public_id: infoMap[d.id]?.public_id || null,
    gender: infoMap[d.id]?.gender || null,
    blood_type: infoMap[d.id]?.blood_type || null,
    age: infoMap[d.id]?.age || null,
    phone: infoMap[d.id]?.contact_phone || null,
    proba_accept: d.proba_accept
  }));

  return finalResults;

}


/**
 * healthCheck
 * -----------
 * Vérifie que le service ML est opérationnel.
 *
 * @returns {Object} - Statut du service ML
 */

async function healthCheck() {

  if (!AI_SERVICE_URL) {
    const err = new Error("AI_SERVICE_URL is not defined in .env");
    err.statusCode = 500;
    throw err;
  }

  if (!INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY not defined in .env");
  }

  try {
    const { data } = await axios.get(
      `${AI_SERVICE_URL}/health`,
      {
        headers: {
          "x-api-key": INTERNAL_API_KEY,
        },
        timeout: 3000,
      }
    );

    logger.info({
      message: "ML health check success",
    });

    return data;
  } catch (error) {
      logger.error({
        message: "ML health check failed",
        error: error.message,
      });
      
      const err = new Error("ML service not responding");
      err.statusCode = 503;
      throw err;
    }
}


/**
 * validateDonation
 * ----------------
 * Valide une donation en créant une entrée dans la table "donations"
 * 
 * @param {*} donorId 
 * @param {*} requestId 
 * @param {*} volumeMl 
 * @returns 
 */

export async function validateDonation(donorId, requestId, volumeMl) {
  if (!donorId) {
    const err = new Error("donor_id is required");
    err.statusCode = 400;
    throw err;
  }

  if (!requestId) {
    const err = new Error("request_id is required");
    err.statusCode = 400;
    throw err;
  }

  if (volumeMl === undefined || volumeMl === null) {
    const err = new Error("volume_ml is required");
    err.statusCode = 400;
    throw err;
  }

  const parsedVolume = Number(volumeMl);

  if (Number.isNaN(parsedVolume) || parsedVolume <= 0) {
    const err = new Error("volume_ml must be a positive number");
    err.statusCode = 400;
    throw err;
  }

  const donation = await createValidatedDonation({
    donorId,
    requestId,
    volumeMl: parsedVolume,
  });

  return donation;
}

/**
 * getValidatedDonations
 * ----------------------
 * Récupère les donations validées pour une demande donnée.
 * 
 * @param {*} requestId 
 * @returns 
 */
export async function getValidatedDonations(requestId) {
  if (!requestId) {
    const err = new Error("request_id is required");
    err.statusCode = 400;
    throw err;
  }

  return await getValidatedDonationsByRequestId(requestId);
}

export { predictTopK, healthCheck};