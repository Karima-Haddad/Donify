// backend/controllers/authController.js
import * as authService from "../src/services/authService.js";
import { validateDonor, validateHospital } from "../src/validators/authValidation.js";

// -------------------- DONOR --------------------
export const registerDonor = async (req, res) => {
  try {
    // Validation des champs
    validateDonor(req.body);

    // Appel du service pour enregistrer le donor
    const donor = await authService.registerDonor(req.body);

    res.status(201).json({
      message: "Donor registered successfully",
      data: donor,
    });
  } catch (err) {
    console.error(err);

    // Email déjà utilisé
    if (err.message.includes("already exists") || err.message.includes("duplicate")) {
      return res.status(409).json({ error: err.message });
    }

    // Erreur de validation
    if (err.message.includes("requis") || err.message.includes("invalide")) {
      return res.status(400).json({ error: err.message });
    }

    // Erreur serveur
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// -------------------- HOSPITAL --------------------
export const registerHospital = async (req, res) => {
  try {
    // Validation des champs
    validateHospital(req.body);

    // Appel du service pour enregistrer l'hôpital
    const hospital = await authService.registerHospital(req.body);

    res.status(201).json({
      message: "Hospital registered successfully",
      data: hospital,
    });
  } catch (err) {
    console.error(err);

    // Email déjà utilisé
    if (err.message.includes("already exists") || err.message.includes("duplicate")) {
      return res.status(409).json({ error: err.message });
    }

    // Erreur de validation
    if (err.message.includes("requis") || err.message.includes("invalide")) {
      return res.status(400).json({ error: err.message });
    }

    // Erreur serveur
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// -------------------- GET TEST --------------------
// Ces endpoints sont uniquement pour tester avec Postman si les données sont bien enregistrées
export const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getAllDonors = async (req, res) => {
  try {
    const donors = await authService.getAllDonors();
    res.status(200).json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch donors" });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await authService.getAllHospitals();
    res.status(200).json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
};