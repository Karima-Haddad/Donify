/**
 * Repository du dashboard hôpital
 * Ce fichier est responsable de l’accès à la base de données.
 * Pour le moment, il retourne des données statiques (mock).
 * Les requêtes SQL seront ajoutées dans l’étape suivante.
 */

/**
 * Repository du dashboard hôpital
 * Ce fichier récupère les données réelles depuis PostgreSQL
 * pour construire les indicateurs du dashboard.
 */

import pool from "../config/database.js";


export async function getHospitalDashboardRepository(hospitalId) {
  // 1. Demandes actives
  const activeRequestsResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM blood_requests
    WHERE hospital_id = $1
      AND status IN ('open', 'in_progress')
    `,
    [hospitalId]
  );

  const activeRequests = parseInt(activeRequestsResult.rows[0].count);

  // 2. Dons validés
  const validatedDonationsResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM donations d
    JOIN blood_requests br ON d.request_id = br.id
    WHERE br.hospital_id = $1
      AND d.validated_by_hospital = true
    `,
    [hospitalId]
  );

  const validatedDonations = parseInt(validatedDonationsResult.rows[0].count);

  // 3. Taux de réponse
  const responseRateResult = await pool.query(
    `
    SELECT 
      CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(
          100.0 * COUNT(*) FILTER (WHERE dr.response_status IN ('accepted', 'refused'))
          / COUNT(*),
          2
        )
      END AS response_rate
    FROM donor_responses dr
    JOIN blood_requests br ON dr.request_id = br.id
    WHERE br.hospital_id = $1
    `,
    [hospitalId]
  );

  const responseRate = parseFloat(responseRateResult.rows[0].response_rate);

  // 4. Stock critique
  const criticalStockResult = await pool.query(
    `
    SELECT blood_type, current_stock_bags
    FROM hospital_blood_stock
    WHERE hospital_id = $1
    ORDER BY current_stock_bags ASC
    LIMIT 1
    `,
    [hospitalId]
  );

  const criticalStock = criticalStockResult.rows[0] || {
    blood_type: null,
    current_stock_bags: 0,
  };

  // Résultat final
  return {
    hospital_id: hospitalId,
    active_requests: activeRequests,
    validated_donations: validatedDonations,
    response_rate: responseRate,
    critical_stock: criticalStock,
  };
}