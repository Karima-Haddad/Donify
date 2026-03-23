import pool from "../config/database.js";

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