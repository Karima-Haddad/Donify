// backend/src/repositories/locationRepository.js
import pool from "../../config/database.js";
import { v4 as uuidv4 } from "uuid";

// ── Récupérer une location existante par city + governorate ───────────
export const getLocationByCityGov = async (city, governorate, client = pool) => {
  const query = `
    SELECT * FROM locations
    WHERE city = $1 AND governorate = $2
    LIMIT 1;
  `;
  const res = await client.query(query, [city, governorate]);
  return res.rows[0] || null;
};

// ── Créer une location (ou réutiliser si elle existe déjà) ───────────
export const createLocation = async (
  { city, governorate, latitude = null, longitude = null },
  client = pool
) => {
  // Vérifier si la location existe déjà pour éviter les doublons en base
  const existing = await getLocationByCityGov(city, governorate, client);
  if (existing) return existing; // ← réutilise la location existante

  // Sinon créer une nouvelle
  const id = uuidv4();
  const query = `
    INSERT INTO locations (id, city, governorate, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [id, city, governorate, latitude, longitude];
  const res = await client.query(query, values);
  return res.rows[0];
};