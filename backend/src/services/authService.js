// backend/src/services/authService.js
import bcrypt from "bcrypt";

import * as userRepo from "../../repositories/userRepository.js";
import * as donorRepo from "../../repositories/donorRepository.js";
import * as hospitalRepo from "../../repositories/hospitalRepository.js";
import * as locationRepo from "../../repositories/locationRepository.js";
import pool from "../../config/database.js";

// ───────────────────────────────────────────────
// REGISTER DONOR
// ───────────────────────────────────────────────
export const registerDonor = async (data) => {

  // 1️⃣ Vérifier si l'email existe déjà
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new Error("Email already exists");

  // 2️⃣ Transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 3️⃣ Créer la location avec coordonnées GPS venant du frontend
    const location = await locationRepo.createLocation(
      {
        city: data.city,
        governorate: data.governorate,
        latitude: data.latitude,    // ← reçu du frontend via tunisiaLocations.js
        longitude: data.longitude   // ← reçu du frontend via tunisiaLocations.js
      },
      client
    );

    // 4️⃣ Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 5️⃣ Créer l'utilisateur
    const createdUser = await userRepo.createUser(
      {
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: "donor",
        contact_phone: data.contact_phone,
        location_id: location.id
      },
      client
    );

    // 6️⃣ Créer le profil donor
    const createdDonor = await donorRepo.createDonor(
      {
        id: createdUser.id,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        blood_type: data.blood_type,
        availability: data.availability ?? true,
        last_donation_date: data.last_donation_date || null,
        next_eligible_date: data.next_eligible_date || null
      },
      client
    );

    await client.query("COMMIT");

    return { user: createdUser, donor: createdDonor };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// ───────────────────────────────────────────────
// REGISTER HOSPITAL
// ───────────────────────────────────────────────
export const registerHospital = async (data) => {

  // 1️⃣ Vérifier si l'email existe déjà
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new Error("Email already exists");

  // 2️⃣ Transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 3️⃣ Créer la location avec coordonnées GPS venant du frontend
    const location = await locationRepo.createLocation(
      {
        city: data.city,
        governorate: data.governorate,
        latitude: data.latitude,    // ← reçu du frontend via tunisiaLocations.js
        longitude: data.longitude   // ← reçu du frontend via tunisiaLocations.js
      },
      client
    );

    // 4️⃣ Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 5️⃣ Créer l'utilisateur
    const createdUser = await userRepo.createUser(
      {
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: "hospital",
        contact_phone: data.contact_phone,
        location_id: location.id
      },
      client
    );

    // 6️⃣ Créer le profil hospital
    const createdHospital = await hospitalRepo.createHospital(
      { id: createdUser.id },
      client
    );

    await client.query("COMMIT");

    return { user: createdUser, hospital: createdHospital };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// ───────────────────────────────────────────────
// GET ALL (tests uniquement)
// ───────────────────────────────────────────────
export const getAllUsers = async () => await userRepo.getAllUsers();
export const getAllDonors = async () => await donorRepo.getAllDonors();
export const getAllHospitals = async () => await hospitalRepo.getAllHospitals();