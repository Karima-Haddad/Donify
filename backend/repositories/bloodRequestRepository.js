// backend/repositories/bloodRequestRepository.js
import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// ── Créer une demande de sang ─────────────────────────────────────────────
export async function createBloodRequest(data, client) {
  const query = `
    INSERT INTO blood_requests (
      hospital_id,
      blood_type,
      quantity,
      location_id,
      status,
      created_at
    )
    VALUES ($1, $2, $3, $4, 'open', NOW())
    RETURNING *;
  `;

  const values = [
    data.hospital_id,
    data.blood_type,
    data.quantity,
    data.location_id,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
}

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







/*============================================================================================================================
KARIMA
/*============================================================================================================================
*/

/**
 * Récupère les 5 dernières demandes d'un hôpital
 * Triées par date décroissante
 */
export async function getRecentBloodRequestsByHospital(hospitalId) {
  const query = `
    SELECT id, blood_type, created_at, status
    FROM blood_requests
    WHERE hospital_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const { rows } = await pool.query(query, [hospitalId]);
  return rows;
}



/**
 * Récupère une demande du sag par son id et revoie ses détails
 */

export async function findBloodRequestById(requestId) {
  const query = `
    SELECT
      br.id,
      br.blood_type,
      br.quantity,
      br.urgency_level,
      br.status,
      br.needed_date,
      br.service,
      br.notes,
      br.created_at,
      br.closed_at,
      br.blood_type,
      br.urgency_level,
      br.status,
      l.city,
      l.governorate
    FROM blood_requests br
    LEFT JOIN locations l ON br.location_id = l.id
    WHERE br.id = $1
  `;

  const result = await pool.query(query, [requestId]);
  return result.rows[0];
}


export async function closeBloodRequestById(requestId) {
  const query = `
    UPDATE blood_requests
    SET
      status = 'satisfied',
      closed_at = NOW()
    WHERE id = $1
    RETURNING id, blood_type, quantity, urgency_level, status, created_at, closed_at
  `;

  const result = await pool.query(query, [requestId]);
  return result.rows[0];
}

