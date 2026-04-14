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
  const client = await pool.connect();

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      availability,
      currentPassword,
      newPassword,
    } = data;

    const bcrypt = await import("bcrypt");
    const fullName = `${lastName} ${firstName}`.trim();

    // 1) Vérifier les champs obligatoires
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      throw new Error("Veuillez remplir les champs obligatoires");
    }

    if (!currentPassword || currentPassword.trim() === "") {
      throw new Error("Le mot de passe actuel est obligatoire");
    }

    // 2) Récupérer l'utilisateur
    const userResult = await client.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [donorId]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Utilisateur introuvable");
    }

    const user = userResult.rows[0];

    // 3) Vérifier le mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // 4) Vérifier le nouveau mot de passe seulement s'il existe
    if (newPassword && newPassword.trim() !== "" && newPassword.length < 8) {
      throw new Error("Le nouveau mot de passe doit contenir au moins 8 caractères");
    }

    // 5) Préparer le hash seulement si nouveau mot de passe rempli
    let hashedPassword = null;
    if (newPassword && newPassword.trim() !== "") {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // 6) Début transaction
    await client.query("BEGIN");

    // Update users
    if (hashedPassword) {
      await client.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             contact_phone = $3,
             password_hash = $4
         WHERE id = $5`,
        [fullName, email, phone || null, hashedPassword, donorId]
      );
    } else {
      await client.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             contact_phone = $3
         WHERE id = $4`,
        [fullName, email, phone || null, donorId]
      );
    }

    // Update donors
    await client.query(
      `UPDATE donors
       SET availability = $1
       WHERE id = $2`,
      [availability, donorId]
    );

    // 7) Validation finale
    await client.query("COMMIT");

    return { message: "Profil mis à jour avec succès" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};