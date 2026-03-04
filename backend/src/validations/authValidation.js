// backend/src/validations/authValidation.js

const tunisianPhoneRegex = /^\+216[0-9]{8}$|^[0-9]{8}$/;
// Accepte soit "+21612345678" (envoyé par le frontend) soit "12345678"

// ───────────────────────────────────────────────
// VALIDATE DONOR
// ───────────────────────────────────────────────
export function validateDonor(data) {

  // Nom
  if (!data.name || data.name.trim() === "")
    throw new Error("Le nom est requis");

  // Email
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    throw new Error("Email invalide");

  // Mot de passe — cohérent avec le frontend (8 car. min)
  if (!data.password || data.password.length < 8)
    throw new Error("Le mot de passe doit contenir au moins 8 caractères");

  // Téléphone — format tunisien
  if (!data.contact_phone || !tunisianPhoneRegex.test(data.contact_phone))
    throw new Error("Numéro de téléphone invalide (8 chiffres requis)");

  // Genre
  if (!data.gender)
    throw new Error("Le sexe est requis");

  // Date de naissance
  if (!data.date_of_birth)
    throw new Error("La date de naissance est requise");

  // Groupe sanguin
  if (!data.blood_type)
    throw new Error("Le groupe sanguin est requis");

  // Ville
  if (!data.city || data.city.trim() === "")
    throw new Error("La ville est requise");

  // Gouvernorat
  if (!data.governorate || data.governorate.trim() === "")
    throw new Error("Le gouvernorat est requis");

  // Availability — conversion flexible (true / "true" / undefined → booléen)
  data.availability = data.availability !== false && data.availability !== "false";
}

// ───────────────────────────────────────────────
// VALIDATE HOSPITAL
// ───────────────────────────────────────────────
export function validateHospital(data) {

  // Nom établissement
  if (!data.name || data.name.trim() === "")
    throw new Error("Le nom de l'établissement est requis");

  // Email
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    throw new Error("Email invalide");

  // Mot de passe — cohérent avec le frontend (8 car. min)
  if (!data.password || data.password.length < 8)
    throw new Error("Le mot de passe doit contenir au moins 8 caractères");

  // Téléphone — format tunisien
  if (!data.contact_phone || !tunisianPhoneRegex.test(data.contact_phone))
    throw new Error("Numéro de téléphone invalide (8 chiffres requis)");

  // Ville
  if (!data.city || data.city.trim() === "")
    throw new Error("La ville est requise");

  // Gouvernorat
  if (!data.governorate || data.governorate.trim() === "")
    throw new Error("Le gouvernorat est requis");
}