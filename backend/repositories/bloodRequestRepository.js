// backend/repositories/bloodRequestRepository.js
import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// ── Créer une demande de sang ─────────────────────────────────────────────
export const createBloodRequest = async (data, client = pool) => {
  const id = uuidv4();
  const now = new Date();

  const query = `
    INSERT INTO blood_requests (id, hospital_id, blood_type, quantity, urgency_level, status, location_id, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    id,
    data.hospital_id,
    data.blood_type,
    data.quantity,
    null,           // urgency_level → null comme convenu
    "open",      // status → automatique
    data.location_id,
    now
  ];

  const res = await client.query(query, values);
  return res.rows[0];
};

// ── Récupérer toutes les demandes d'un hôpital ────────────────────────────
export const getBloodRequestsByHospital = async (hospital_id, client = pool) => {
  const query = `
    SELECT * FROM blood_requests
    WHERE hospital_id = $1
    ORDER BY created_at DESC;
  `;
  const res = await client.query(query, [hospital_id]);
  return res.rows;
};

// ── Récupérer une demande par ID ──────────────────────────────────────────
export const getBloodRequestById = async (id, client = pool) => {
  const query = `
    SELECT * FROM blood_requests WHERE id = $1;
  `;
  const res = await client.query(query, [id]);
  return res.rows[0] || null;
};