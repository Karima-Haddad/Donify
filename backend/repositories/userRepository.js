// backend/repositories/userRepository.js
// backend/src/repositories/userRepository.js
import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// ── Créer un utilisateur ──────────────────────────────────────────────
export const createUser = async (user, client = pool) => {
  const id = uuidv4();
  const now = new Date();

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
    now,
    now
  ];

  const res = await client.query(query, values);
  return res.rows[0];
};

// ── Trouver un utilisateur par email ─────────────────────────────────
export const findUserByEmail = async (email, client = pool) => {
  const res = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0] || null;
};

// ── GET ALL USERS ────────────────────────────────────────────────────
export const getAllUsers = async (client = pool) => {
  const res = await client.query("SELECT * FROM users");
  return res.rows;
};

// ── GET USERS BY ROLE ────────────────────────────────────────────────
export const getUsersByRole = async (role, client = pool) => {
  const res = await client.query(
    "SELECT * FROM users WHERE role = $1",
    [role]
  );
  return res.rows;
};

// ── UPDATE PASSWORD (FIX AJOUTÉ) ─────────────────────────────────────
export const updatePassword = async (userId, hashedPassword, client = pool) => {
  const query = `
    UPDATE users
    SET password_hash = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;

  const values = [hashedPassword, userId];

  const res = await client.query(query, values);
  return res.rows[0] || null;
};
