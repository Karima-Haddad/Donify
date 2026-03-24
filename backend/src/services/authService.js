// backend/src/services/authService.js

import bcrypt from "bcrypt";

import * as userRepo from "../repositories/userRepository.js";
import * as donorRepo from "../../repositories/donorRepository.js";
import * as hospitalRepo from "../repositories/hospitalRepository.js";
import * as locationRepo from "../repositories/locationRepository.js";

import pool from "../../config/database.js";

// ───────────────────────────────────────────────
// REGISTER DONOR
// ───────────────────────────────────────────────
export const registerDonor = async (data) => {
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new Error("Email already exists");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Create location
    const location = await locationRepo.createLocation(
      {
        city: data.city,
        governorate: data.governorate,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      client
    );

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3️⃣ Create user
    const createdUser = await userRepo.createUser(
      {
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: "donor",
        contact_phone: data.contact_phone,
        location_id: location.id,
      },
      client
    );

    // 4️⃣ Create donor
    const createdDonor = await donorRepo.createDonor(
      {
        id: createdUser.id,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        blood_type: data.blood_type,
        availability: data.availability ?? true,
        last_donation_date: data.last_donation_date || null,
        next_eligible_date: data.next_eligible_date || null,
      },
      client
    );

    await client.query("COMMIT");

    return {
      user: createdUser,
      donor: createdDonor,
    };
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
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new Error("Email already exists");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Create location
    const location = await locationRepo.createLocation(
      {
        city: data.city,
        governorate: data.governorate,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      client
    );

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3️⃣ Create user
    const createdUser = await userRepo.createUser(
      {
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: "hospital",
        contact_phone: data.contact_phone,
        location_id: location.id,
      },
      client
    );

    // 4️⃣ Create hospital
    const createdHospital = await hospitalRepo.createHospital(
      {
        id: createdUser.id,
      },
      client
    );

    await client.query("COMMIT");

    return {
      user: createdUser,
      hospital: createdHospital,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// ───────────────────────────────────────────────
// LOGIN USER
// ───────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  // 1️⃣ Get user
  const user = await userRepo.findUserByEmail(email);
  console.log("FOUND USER:", user); // debug

  if (!user) return null;

  // 2️⃣ Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return null;

  // 3️⃣ Return user data
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
};

// ───────────────────────────────────────────────
// FIND USER BY EMAIL
// ───────────────────────────────────────────────
export const findUserByEmail = async (email) => {
  return await userRepo.findUserByEmail(email);
};

// ───────────────────────────────────────────────
// UPDATE PASSWORD
// ───────────────────────────────────────────────
export const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepo.updatePassword(userId, hashedPassword);
};

// ───────────────────────────────────────────────
// GET ALL USERS (TEST)
// ───────────────────────────────────────────────
export const getAllUsers = async () => {
  return await userRepo.getAllUsers();
};

export const getAllDonors = async () => {
  return await donorRepo.getAllDonors();
};

export const getAllHospitals = async () => {
  return await hospitalRepo.getAllHospitals();
};
