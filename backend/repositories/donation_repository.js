import pool from "../config/database.js";

export async function createValidatedDonation({ donorId, requestId, volumeMl }) {
  const query = `
    INSERT INTO donations (
      donor_id,
      request_id,
      donation_date,
      validated_by_hospital,
      volume_ml
    )
    VALUES ($1, $2, CURRENT_DATE, true, $3)
    RETURNING *
  `;

  const values = [donorId, requestId, volumeMl];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

export async function getValidatedDonationsByRequestId(requestId) {
  const query = `
    SELECT
      d.donor_id,
      d.request_id,
      d.donation_date,
      d.volume_ml,
      u.public_id,
      dn.gender,
      dn.blood_type,
      EXTRACT(YEAR FROM AGE(CURRENT_DATE, dn.date_of_birth))::int AS age,
      u.contact_phone AS phone
    FROM donations d
    JOIN donors dn ON d.donor_id = dn.id
    JOIN users u ON dn.id = u.id
    WHERE d.request_id = $1
      AND d.validated_by_hospital = true
    ORDER BY d.created_at DESC
  `;

  const { rows } = await pool.query(query, [requestId]);
  return rows;
}