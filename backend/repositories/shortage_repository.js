import pool from "../config/database.js";

// ===============================
// 0. Vérifier si l'hôpital existe
// ===============================
export async function hospitalExists(hospitalId) {
  const query = `
    SELECT 1
    FROM hospitals
    WHERE id = $1
    LIMIT 1
  `;

  const { rowCount } = await pool.query(query, [hospitalId]);
  return rowCount > 0;
}

// ===============================
// 1. Demandes du jour
// ===============================
export async function getTodayRequests(hospitalId) {
  const query = `
    SELECT
      br.blood_type,
      COALESCE(SUM(br.quantity), 0)::numeric AS total_requested_bags
    FROM blood_requests br
    WHERE br.hospital_id = $1
      AND DATE(br.created_at) = CURRENT_DATE
    GROUP BY br.blood_type
  `;

  const { rows } = await pool.query(query, [hospitalId]);
  return rows;
}

// ===============================
// 2. Dons du jour
// ===============================
// donations n'a pas hospital_id ni blood_type directement
// on passe par blood_requests via request_id
// on convertit volume_ml en "bags" avec /450
export async function getTodayDonations(hospitalId) {
  const query = `
    SELECT
      br.blood_type,
      COALESCE(
        SUM(
          CASE
            WHEN d.volume_ml IS NOT NULL THEN ROUND(d.volume_ml / 450.0)
            ELSE 0
          END
        ),
        0
      )::int AS total_donated_bags
    FROM donations d
    JOIN blood_requests br ON br.id = d.request_id
    WHERE br.hospital_id = $1
      AND d.validated_by_hospital = true
      AND d.donation_date = CURRENT_DATE
    GROUP BY br.blood_type
  `;

  const { rows } = await pool.query(query, [hospitalId]);
  return rows;
}

// ===============================
// 3. Demandes des 7 derniers jours
// ===============================
export async function getRequestsLast7Days(hospitalId) {
  const query = `
    SELECT
      br.blood_type,
      COALESCE(SUM(br.quantity), 0)::numeric AS req_7d
    FROM blood_requests br
    WHERE br.hospital_id = $1
      AND br.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY br.blood_type
  `;

  const { rows } = await pool.query(query, [hospitalId]);
  return rows;
}

// ===============================
// 4. Dons des 7 derniers jours
// ===============================
export async function getDonationsLast7Days(hospitalId) {
  const query = `
    SELECT
      br.blood_type,
      COALESCE(
        SUM(
          CASE
            WHEN d.volume_ml IS NOT NULL THEN ROUND(d.volume_ml / 450.0)
            ELSE 0
          END
        ),
        0
      )::int AS don_7d
    FROM donations d
    JOIN blood_requests br ON br.id = d.request_id
    WHERE br.hospital_id = $1
      AND d.validated_by_hospital = true
      AND d.donation_date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY br.blood_type
  `;

  const { rows } = await pool.query(query, [hospitalId]);
  return rows;
}

// ===============================
// 5. Stock actuel
// ===============================
export async function getCurrentStock(hospitalId) {
  const query = `
    SELECT
      hbs.blood_type,
      hbs.current_stock_bags
    FROM hospital_blood_stock hbs
    WHERE hbs.hospital_id = $1
  `;

  const { rows } = await pool.query(query, [hospitalId]);
  return rows;
}