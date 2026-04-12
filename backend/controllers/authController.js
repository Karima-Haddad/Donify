// backend/src/controllers/authController.js

import * as authService from "../src/services/authService.js";
import { validateDonor, validateHospital } from "../src/validators/authValidation.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// -------------------- CONFIG EMAIL --------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// -------------------- REGISTER DONOR --------------------
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




// // -------------------- GET TEST --------------------
// // Ces endpoints sont uniquement pour tester avec Postman si les données sont bien enregistrées
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await authService.getAllUsers();
//     res.status(200).json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };

// export const getAllDonors = async (req, res) => {
//   try {
//     const donors = await authService.getAllDonors();
//     res.status(200).json(donors);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch donors" });
//   }
// };

// export const getAllHospitals = async (req, res) => {
//   try {
//     const hospitals = await authService.getAllHospitals();
//     res.status(200).json(hospitals);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch hospitals" });
//   }
// };



// -------------------- LOGIN --------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser({ email, password });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      role: user.role,
      id: user.id,
      name: user.name,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Générer token
    const token = jwt.sign(
      { id: user.id, email: user.email, purpose: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // ✅ ENVOI EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // TON email
      to: email,                    // email utilisateur
      subject: "Réinitialisation du mot de passe",
      html: `
        <h2>Réinitialisation du mot de passe</h2>
        <p>Bonjour,</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expire dans 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "Email envoyé avec succès",
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Erreur envoi email" });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token et mot de passe requis",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "reset") {
      return res.status(400).json({ message: "Token invalide" });
    }

    await authService.updatePassword(decoded.id, password);

    res.status(200).json({
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(400).json({
      message: "Token invalide ou expiré",
    });
  }
};

// -------------------- GET USERS --------------------
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
