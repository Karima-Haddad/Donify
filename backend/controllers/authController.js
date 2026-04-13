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

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;


    // ✅ ENVOI EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // TON email
      to: email,                    // email utilisateur
      subject: "Réinitialisation du mot de passe",
      html: `
      <div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8; padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                
                <tr>
                  <td style="background:linear-gradient(135deg, #b32017, #dc2626); padding:30px; text-align:center; color:white;">
                    <h1 style="margin:0; font-size:28px;">Donify</h1>
                    <p style="margin:8px 0 0; font-size:14px; opacity:0.95;">
                      Plateforme intelligente de don de sang
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px 30px; color:#1f2937;">
                    <h2 style="margin-top:0; font-size:24px; color:#b32017;">
                      Réinitialisation du mot de passe
                    </h2>

                    <p style="font-size:16px; line-height:1.6; margin:16px 0;">
                      Bonjour,
                    </p>

                    <p style="font-size:16px; line-height:1.6; margin:16px 0;">
                      Nous avons reçu une demande de réinitialisation de votre mot de passe.
                      Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a 
                        href="${resetLink}" 
                        style="display:inline-block; background:linear-gradient(135deg, #b32017, #dc2626); color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:10px; font-size:16px; font-weight:bold;"
                      >
                        Réinitialiser mon mot de passe
                      </a>
                    </div>

                    <p style="font-size:14px; line-height:1.6; color:#6b7280; margin:16px 0;">
                      Ce lien expirera dans <strong>15 minutes</strong>.
                    </p>

                    <p style="font-size:14px; line-height:1.6; color:#6b7280; margin:16px 0;">
                      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                    </p>

                    <p style="word-break:break-all; font-size:14px; color:#2563eb;">
                      <a href="${resetLink}" style="color:#2563eb; text-decoration:none;">
                        ${resetLink}
                      </a>
                    </p>

                    <p style="font-size:14px; line-height:1.6; color:#6b7280; margin-top:30px;">
                      Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background:#f9fafb; padding:20px 30px; text-align:center; font-size:12px; color:#9ca3af;">
                    © ${new Date().getFullYear()} Donify — Tous droits réservés
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
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
