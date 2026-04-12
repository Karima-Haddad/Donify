// backend/repositories/donorRepository.js
// backend/src/repositories/donorRepository.js
import pool from "../config/database.js";

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


export const updateDonorProfilRepository = async (donorId, data) => {
  const { firstName, lastName, email, phone, city, lastDonation, availability, newPassword } = data;

  const fullName = `${lastName} ${firstName}`;

  await pool.query(
    `UPDATE users u
     SET name=$1, email=$2, contact_phone=$3
     WHERE id=$4`,
    [fullName, email, phone, donorId]
  );

  await pool.query(
    `UPDATE donors d
     SET last_donation_date=$1, availability=$2
     WHERE id=$3`,
    [lastDonation, availability, donorId]
  );

  if (newPassword) {
    // Hash password avant update
    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE users SET password_hash=$1 WHERE id=$2`,
      [hashed, donorId]
    );
  }

  return { message: "Profil mis à jour avec succès" };
};