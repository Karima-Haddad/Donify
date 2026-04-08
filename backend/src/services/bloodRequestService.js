// backend/src/services/bloodRequestService.js
import pool from "../../config/database.js";
import * as bloodRequestRepo from "../../repositories/bloodRequestRepository.js";
import { getTopKDonors } from "./matching_model.js";
import { getRecentBloodRequestsByHospital,closeBloodRequestById,findBloodRequestById } from "../../repositories/bloodRequestRepository.js";
import { createNotificationsForDonors } from "./notificationService.js";


// ── Créer une demande de sang ─────────────────────────────────────────────
export const createBloodRequest = async (hospital_id, data) => {
 
  // 1️⃣ Récupérer le location_id de l'hôpital depuis la table users
  const userResult = await pool.query(
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
 
  // 2️⃣ Créer la demande de sang avec tous les champs
  const bloodRequest = await bloodRequestRepo.createBloodRequest({
    hospital_id,
    blood_type:  data.blood_type,
    quantity:    data.quantity,
    location_id,
    needed_date: data.needed_date ,  
    service:     data.service     || null,  
    notes:       data.notes       || null,  
  }, pool);
 
  return bloodRequest;
};

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

