// backend/src/repositories/hospitalRepository.js
import pool from "../../config/database.js";

// ── Créer un profil hospital ──────────────────────────────────────────
export const createHospital = async (hospital, client = pool) => {
  const query = `
    INSERT INTO hospitals (id)
    VALUES ($1)
    RETURNING *;
  `;
  const res = await client.query(query, [hospital.id]);
  return res.rows[0];
};

// ── GET ALL hospitals (tests uniquement) ──────────────────────────────
export const getAllHospitals = async (client = pool) => {
  const res = await client.query(
    "SELECT * FROM users WHERE role = 'hospital'"
  );
  return res.rows;
};