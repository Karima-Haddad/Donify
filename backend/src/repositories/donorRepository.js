// backend/src/repositories/donorRepository.js
import pool from "../../config/database.js";

// ── Créer un profil donor ─────────────────────────────────────────────
export const createDonor = async (donor, client = pool) => {
  const query = `
    INSERT INTO donors (id, gender, date_of_birth, blood_type, availability, last_donation_date, next_eligible_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    donor.id,
    donor.gender,
    donor.date_of_birth,
    donor.blood_type,
    donor.availability,
    donor.last_donation_date  || null,
    donor.next_eligible_date  || null
  ];
  const res = await client.query(query, values);
  return res.rows[0];
};

// ── GET ALL donors avec infos user (tests uniquement) ─────────────────
export const getAllDonors = async (client = pool) => {
  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.contact_phone,
      u.location_id,
      u.created_at,
      u.updated_at,
      d.gender,
      d.date_of_birth,
      d.blood_type,
      d.availability,
      d.last_donation_date,
      d.next_eligible_date
    FROM users u
    JOIN donors d ON u.id = d.id
    WHERE u.role = 'donor'
  `;
  const res = await client.query(query);
  return res.rows;
};