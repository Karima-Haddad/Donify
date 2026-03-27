// backend/src/services/bloodRequestService.js
import pool from "../../config/database.js";
import * as bloodRequestRepo from "../../repositories/bloodRequestRepository.js";
import { getTopKDonors } from "./matching_model.js";
import { getRecentBloodRequestsByHospital,closeBloodRequestById,findBloodRequestById } from "../../repositories/bloodRequestRepository.js";
import { createNotificationsForDonors } from "./notificationService.js";


// ── Créer une demande de sang ─────────────────────────────────────────────
export async function createBloodRequest(hospital_id, data) {
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      "SELECT location_id FROM users WHERE id = $1 AND role = 'hospital'",
      [hospital_id]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Hôpital introuvable");
    }

    const location_id = userResult.rows[0].location_id;

    if (!location_id) {
      throw new Error("Localisation de l'hôpital non définie");
    }

    await client.query("BEGIN");

    const bloodRequest = await bloodRequestRepo.createBloodRequest(
      {
        hospital_id,
        blood_type: data.blood_type,
        quantity: data.quantity,
        location_id,
      },
      client
    );

    // rendre la demande visible en base
    await client.query("COMMIT");

    let donors = [];

    try {
      donors = await getTopKDonors(
        bloodRequest.blood_type,
        100,
        bloodRequest.id
      );

      const notifClient = await pool.connect();
      try {
        await notifClient.query("BEGIN");

        await createNotificationsForDonors(notifClient, {
          bloodRequest,
          donors,
        });

        await notifClient.query("COMMIT");
      } catch (error) {
        await notifClient.query("ROLLBACK");
        console.error("Erreur lors de la création des notifications :", error);
      } finally {
        notifClient.release();
      }
    } catch (error) {
      console.error("Erreur lors du process TopK/notifications :", error);
    }

    return {
      bloodRequest,
      notifiedDonorsCount: donors.length,
    };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    throw error;
  } finally {
    client.release();
  }
}

// ── Récupérer les demandes d'un hôpital ──────────────────────────────────
export const getBloodRequestsByHospital = async (hospital_id) => {
  return await bloodRequestRepo.getBloodRequestsByHospital(hospital_id);
};

// ── Récupérer une demande par ID ──────────────────────────────────────────
export const getBloodRequestById = async (id) => {
  const request = await bloodRequestRepo.getBloodRequestById(id);
  if (!request) throw new Error("Demande introuvable");
  return request;
};



















/*================================================================================================================================
KARIMA
================================================================================================================================
*/

export async function fetchRecentBloodRequests(hospitalId) {
  if (!hospitalId) {
    const error = new Error("hospitalId est requis");
    error.statusCode = 400;
    throw error;
  }

  return await getRecentBloodRequestsByHospital(hospitalId);
}

export async function closeBloodRequest(requestId) {
  const request = await findBloodRequestById(requestId);

  if (!request) {
    const error = new Error("Demande introuvable.");
    error.status = 404;
    throw error;
  }

  if (request.status === "satisfied" || request.status === "expired") {
    const error = new Error("Cette demande est déjà clôturée.");
    error.status = 400;
    throw error;
  }

  const updatedRequest = await closeBloodRequestById(requestId);
  return updatedRequest;
}

