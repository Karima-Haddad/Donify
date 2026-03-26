// backend/src/services/bloodRequestService.js
import pool from "../../config/database.js";
import * as bloodRequestRepo from "../../repositories/bloodRequestRepository.js";

// ── Créer une demande de sang ─────────────────────────────────────────────
export const createBloodRequest = async (hospital_id, data) => {

  // 1️⃣ Récupérer le location_id de l'hôpital depuis la table users
  // On utilise le hospital_id (= users.id) pour trouver sa localisation
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

  // 2️⃣ Créer la demande de sang
  const bloodRequest = await bloodRequestRepo.createBloodRequest({
    hospital_id,
    blood_type: data.blood_type,
    quantity: data.quantity,
    location_id
  });

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