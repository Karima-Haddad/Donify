// backend/repositories/userRepository.js
// backend/src/repositories/userRepository.js
import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// ── Créer un utilisateur ──────────────────────────────────────────────
export const createUser = async (user, client = pool) => {
  const id = uuidv4();
  const now = new Date(); // ← created_at et updated_at générés automatiquement

  const query = `
    INSERT INTO users (id, name, email, password_hash, role, contact_phone, location_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    id,
    user.name,
    user.email,
    user.password_hash,
    user.role,
    user.contact_phone,
    user.location_id,
    now,  // created_at
    now   // updated_at
  ];

  const res = await client.query(query, values);
  return res.rows[0];
};

// ── Trouver un utilisateur par email ─────────────────────────────────
// Utilisé pour vérifier si l'email existe déjà avant l'inscription
export const findUserByEmail = async (email, client = pool) => {
  const res = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0] || null;
};

// ── GET ALL (tests uniquement) ────────────────────────────────────────
export const getAllUsers = async (client = pool) => {
  const res = await client.query("SELECT * FROM users");
  return res.rows;
};

export const getUsersByRole = async (role, client = pool) => {
  const res = await client.query(
    "SELECT * FROM users WHERE role = $1",
    [role]
  );
  return res.rows;
};