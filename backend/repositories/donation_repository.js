import pool from "../config/database.js";

export async function createValidatedDonation({
  donorId,
  requestId,
  volumeMl,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const donorResult = await client.query(
      `
      SELECT gender
      FROM donors
      WHERE id = $1
      `,
      [donorId]
    );

    if (donorResult.rowCount === 0) {
      throw new Error("Donneur introuvable");
    }

    const donor = donorResult.rows[0];

    const donationDate = new Date();

    let nextEligibleDateQuery;
    if (donor.gender?.toLowerCase() === "female") {
      nextEligibleDateQuery = `CURRENT_DATE + INTERVAL '120 days'`;
    } else {
      nextEligibleDateQuery = `CURRENT_DATE + INTERVAL '90 days'`;
    }

    const donationResult = await client.query(
      `
      INSERT INTO donations (
        donor_id,
        request_id,
        donation_date,
        validated_by_hospital,
        volume_ml
      )
      VALUES ($1, $2, CURRENT_DATE, true, $3)
      RETURNING *
      `,
      [donorId, requestId, volumeMl]
    );

    await client.query(
      `
      UPDATE donors
      SET
        last_donation_date = CURRENT_DATE,
        next_eligible_date = ${nextEligibleDateQuery}
      WHERE id = $1
      `,
      [donorId]
    );

    await client.query("COMMIT");

    return donationResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


/**
 * 
 */
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
