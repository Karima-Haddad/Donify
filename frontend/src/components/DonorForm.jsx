import { useState } from "react";
import { registerDonor } from "../services/authService";
import {
  governoratesList,
  getCitiesByGovernorate,
  getCoordinates
} from "../data/tunisiaLocations";

export default function DonorForm() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    contact_phone: "",
    blood_type: "",
    gender: "",
    date_of_birth: "",
    weight: "",
    availability: true,
    city: "",
    governorate: "",
    hasDonatedBefore: "",
    lastDonationDate: "",
    chronicDisease: "",
    chronicDiseaseDetails: "",
    hasTattooOrPiercing: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const cities = getCitiesByGovernorate(formData.governorate);

  const tunisianPhoneRegex = /^[0-9]{8}$/;
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // ── Calcul de l'âge ───────────────────────────────────────────────────
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "governorate") {
      setFormData(prev => ({ ...prev, governorate: value, city: "" }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "nom" && !value.trim())
      error = "Le nom est requis";

    if (name === "prenom" && !value.trim())
      error = "Le prénom est requis";

    if (name === "email" && !/\S+@\S+\.\S+/.test(value))
      error = "Email invalide";

    if (name === "contact_phone" && !tunisianPhoneRegex.test(value))
      error = "Le numéro doit contenir exactement 8 chiffres";

    if (name === "gender" && !value)
      error = "Le sexe est requis";

    if (name === "date_of_birth") {
      if (!value) {
        error = "La date de naissance est requise";
      } else {
        const age = calculateAge(value);
        if (age < 18)
          error = "Vous devez avoir au moins 18 ans pour donner votre sang";
        else if (age > 65)
          error = "Le don de sang n'est pas autorisé après 65 ans";
      }
    }

    // ── Validation poids ─────────────────────────────────────────────
    if (name === "weight") {
      if (!value)
        error = "Le poids est requis";
      else if (isNaN(value) || Number(value) <= 0)
        error = "Veuillez entrer un poids valide";
      else if (Number(value) < 50)
        error = "Vous devez peser au moins 50 kg pour donner votre sang";
    }

    if (name === "blood_type" && !value)
      error = "Le groupe sanguin est requis";

    if (name === "governorate" && !value)
      error = "Le gouvernorat est requis";

    if (name === "city" && !value)
      error = "La ville est requise";

    if (name === "hasDonatedBefore" && !value)
      error = "Ce champ est requis";

    if (name === "lastDonationDate" && formData.hasDonatedBefore === "yes" && !value)
      error = "Veuillez entrer la date du dernier don";

    if (name === "chronicDisease" && !value)
      error = "Ce champ est requis";

    if (name === "chronicDiseaseDetails" && formData.chronicDisease === "yes" && !value.trim())
      error = "Veuillez préciser la maladie";

    if (name === "hasTattooOrPiercing" && !value)
      error = "Ce champ est requis";

    if (name === "password" && !strongPasswordRegex.test(value))
      error = "Mot de passe faible (8 caractères min, maj, min, chiffre, symbole)";

    if (name === "confirmPassword" && value !== formData.password)
      error = "Les mots de passe ne correspondent pas";

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateField(e.target.name, e.target.value);
      e.target.focus();
    }
  };

  const validateAll = () => {
    let newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!tunisianPhoneRegex.test(formData.contact_phone))
      newErrors.contact_phone = "Le numéro doit contenir exactement 8 chiffres";
    if (!formData.gender) newErrors.gender = "Le sexe est requis";

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "La date de naissance est requise";
    } else {
      const age = calculateAge(formData.date_of_birth);
      if (age < 18)
        newErrors.date_of_birth = "Vous devez avoir au moins 18 ans pour donner votre sang";
      else if (age > 65)
        newErrors.date_of_birth = "Le don de sang n'est pas autorisé après 65 ans";
    }

    // ── Validation poids dans validateAll ────────────────────────────
    if (!formData.weight) {
      newErrors.weight = "Le poids est requis";
    } else if (isNaN(formData.weight) || Number(formData.weight) <= 0) {
      newErrors.weight = "Veuillez entrer un poids valide";
    } else if (Number(formData.weight) < 50) {
      newErrors.weight = "Vous devez peser au moins 50 kg pour donner votre sang";
    }

    if (!formData.blood_type) newErrors.blood_type = "Le groupe sanguin est requis";
    if (!formData.governorate) newErrors.governorate = "Le gouvernorat est requis";
    if (!formData.city) newErrors.city = "La ville est requise";
    if (!formData.hasDonatedBefore) newErrors.hasDonatedBefore = "Ce champ est requis";
    if (formData.hasDonatedBefore === "yes" && !formData.lastDonationDate)
      newErrors.lastDonationDate = "Veuillez entrer la date du dernier don";
    if (!formData.chronicDisease) newErrors.chronicDisease = "Ce champ est requis";
    if (formData.chronicDisease === "yes" && !formData.chronicDiseaseDetails.trim())
      newErrors.chronicDiseaseDetails = "Veuillez préciser la maladie";
    if (!formData.hasTattooOrPiercing) newErrors.hasTattooOrPiercing = "Ce champ est requis";
    if (!strongPasswordRegex.test(formData.password))
      newErrors.password = "Mot de passe faible (8 caractères min, maj, min, chiffre, symbole)";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Blocage maladie chronique
    if (formData.chronicDisease === "yes") {
      setErrors(prev => ({
        ...prev,
        chronicDisease:
          "Nous sommes désolés, les personnes souffrant d'une maladie chronique grave ne peuvent pas effectuer de don de sang."
      }));
      return;
    }

    // Blocage tatouage/piercing
    if (formData.hasTattooOrPiercing === "yes") {
      setErrors(prev => ({
        ...prev,
        hasTattooOrPiercing:
          "Vous devez attendre 6 mois après un tatouage ou piercing avant de pouvoir donner votre sang."
      }));
      return;
    }

    setLoading(true);

    try {
      // Calcul next_eligible_date selon le sexe
      let last_donation_date = null;
      let next_eligible_date = null;

      if (formData.hasDonatedBefore === "yes" && formData.lastDonationDate) {
        last_donation_date = formData.lastDonationDate;
        const nextDate = new Date(formData.lastDonationDate);
        if (formData.gender === "female") {
          nextDate.setMonth(nextDate.getMonth() + 4);
        } else {
          nextDate.setMonth(nextDate.getMonth() + 3);
        }
        next_eligible_date = nextDate.toISOString().split("T")[0];
      }

      // Coordonnées GPS automatiques
      const { latitude, longitude } = getCoordinates(formData.governorate, formData.city);

      // Le poids n'est pas envoyé au backend car il n'existe pas en base
      // Il sert uniquement à valider l'éligibilité du donneur
      const payload = {
        name: `${formData.nom} ${formData.prenom}`,
        email: formData.email,
        password: formData.password,
        contact_phone: `+216${formData.contact_phone}`,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        blood_type: formData.blood_type,
        availability: formData.availability,
        city: formData.city,
        governorate: formData.governorate,
        latitude,
        longitude,
        last_donation_date,
        next_eligible_date
      };

      await registerDonor(payload);
      alert("Compte créé avec succès !");

      setFormData({
        nom: "", prenom: "", email: "", contact_phone: "",
        blood_type: "", gender: "", date_of_birth: "", weight: "",
        availability: true, city: "", governorate: "",
        hasDonatedBefore: "", lastDonationDate: "",
        chronicDisease: "", chronicDiseaseDetails: "",
        hasTattooOrPiercing: "", password: "", confirmPassword: ""
      });
      setErrors({});
    } catch (error) {
      alert(error.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">

      {/* Nom */}
      <div className={`input-group ${errors.nom ? "has-error" : ""}`}>
        <input type="text" name="nom" value={formData.nom}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Nom</label>
        {errors.nom && <small className="error">{errors.nom}</small>}
      </div>

      {/* Prénom */}
      <div className={`input-group ${errors.prenom ? "has-error" : ""}`}>
        <input type="text" name="prenom" value={formData.prenom}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Prénom</label>
        {errors.prenom && <small className="error">{errors.prenom}</small>}
      </div>

      {/* Email */}
      <div className={`input-group ${errors.email ? "has-error" : ""}`}>
        <input type="email" name="email" value={formData.email}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Email</label>
        {errors.email && <small className="error">{errors.email}</small>}
      </div>

      {/* Téléphone */}
      <div className={`input-group ${errors.contact_phone ? "has-error" : ""}`}>
        <input type="text" name="contact_phone" value={formData.contact_phone}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Téléphone (8 chiffres)</label>
        {errors.contact_phone && <small className="error">{errors.contact_phone}</small>}
      </div>

      {/* Sexe */}
      <div className={`input-group ${errors.gender ? "has-error" : ""}`}>
        <label className="select-label">Sexe</label>
        <select name="gender" value={formData.gender}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}>
          <option value="">Sélectionner</option>
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
        {errors.gender && <small className="error">{errors.gender}</small>}
      </div>

      {/* Date de naissance */}
      <div className={`input-group ${errors.date_of_birth ? "has-error" : ""}`}>
        <input type="date" name="date_of_birth" value={formData.date_of_birth}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Date de naissance</label>
        {errors.date_of_birth && <small className="error">{errors.date_of_birth}</small>}
      </div>

      {/* Poids */}
      <div className={`input-group ${errors.weight ? "has-error" : ""}`}>
        <input type="number" name="weight" value={formData.weight}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=" "
          min="1" max="300" />
        <label className="floating-label">Poids (kg)</label>
        {errors.weight && <small className="error">{errors.weight}</small>}
      </div>

      {/* Groupe sanguin */}
      <div className={`input-group ${errors.blood_type ? "has-error" : ""}`}>
        <label className="select-label">Groupe sanguin</label>
        <select name="blood_type" value={formData.blood_type}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}>
          <option value="">Sélectionner</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>O+</option>
          <option>O-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
        {errors.blood_type && <small className="error">{errors.blood_type}</small>}
      </div>

      {/* Gouvernorat */}
      <div className={`input-group ${errors.governorate ? "has-error" : ""}`}>
        <label className="select-label">Gouvernorat</label>
        <select name="governorate" value={formData.governorate}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}>
          <option value="">Sélectionner</option>
          {governoratesList.map((gov) => (
            <option key={gov} value={gov}>{gov}</option>
          ))}
        </select>
        {errors.governorate && <small className="error">{errors.governorate}</small>}
      </div>

      {/* Ville */}
      <div className={`input-group ${errors.city ? "has-error" : ""}`}>
        <label className="select-label">Ville</label>
        <select name="city" value={formData.city}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!formData.governorate}>
          <option value="">
            {formData.governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat"}
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {errors.city && <small className="error">{errors.city}</small>}
      </div>

      {/* Q1 : Don antérieur */}
      <div className={`input-group full-width ${errors.hasDonatedBefore ? "has-error" : ""}`}>
        <label className="select-label">Avez-vous déjà effectué un don de sang ?</label>
        <select name="hasDonatedBefore" value={formData.hasDonatedBefore}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}>
          <option value="">Sélectionner</option>
          <option value="no">Non</option>
          <option value="yes">Oui</option>
        </select>
        {errors.hasDonatedBefore && <small className="error">{errors.hasDonatedBefore}</small>}
      </div>

      {/* Date dernier don */}
      {formData.hasDonatedBefore === "yes" && (
        <div className={`input-group full-width ${errors.lastDonationDate ? "has-error" : ""}`}>
          <input type="date" name="lastDonationDate" value={formData.lastDonationDate}
            onChange={handleChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            onKeyDown={handleKeyDown} placeholder=" " />
          <label className="floating-label">Date du dernier don</label>
          {errors.lastDonationDate && <small className="error">{errors.lastDonationDate}</small>}
        </div>
      )}

      {/* Q2 : Maladies chroniques */}
      <div className={`input-group full-width ${errors.chronicDisease ? "has-error" : ""}`}>
        <label className="select-label">Souffrez-vous d'une maladie chronique grave ?</label>
        <select name="chronicDisease" value={formData.chronicDisease}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}>
          <option value="">Sélectionner</option>
          <option value="no">Non</option>
          <option value="yes">Oui</option>
        </select>
        {errors.chronicDisease && <small className="error">{errors.chronicDisease}</small>}
      </div>

      {/* Précision maladie */}
      {formData.chronicDisease === "yes" && (
        <div className={`input-group full-width ${errors.chronicDiseaseDetails ? "has-error" : ""}`}>
          <input type="text" name="chronicDiseaseDetails" value={formData.chronicDiseaseDetails}
            onChange={handleChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            onKeyDown={handleKeyDown} placeholder=" " />
          <label className="floating-label">Veuillez préciser la maladie</label>
          {errors.chronicDiseaseDetails && <small className="error">{errors.chronicDiseaseDetails}</small>}
        </div>
      )}

      {/* Q3 : Tatouage / Piercing */}
      <div className={`input-group full-width ${errors.hasTattooOrPiercing ? "has-error" : ""}`}>
        <label className="select-label">Avez-vous un tatouage ou piercing de moins de 6 mois ?</label>
        <select name="hasTattooOrPiercing" value={formData.hasTattooOrPiercing}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}>
          <option value="">Sélectionner</option>
          <option value="no">Non</option>
          <option value="yes">Oui</option>
        </select>
        {errors.hasTattooOrPiercing && <small className="error">{errors.hasTattooOrPiercing}</small>}
      </div>

      {/* Mot de passe */}
      <div className={`input-group full-width ${errors.password ? "has-error" : ""}`}>
        <input
          type={showPassword ? "text" : "password"}
          name="password" value={formData.password}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Mot de passe (8 car. min, maj, chiffre, symbole)</label>
        <span className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
          <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
        </span>
        {errors.password && <small className="error">{errors.password}</small>}
      </div>

      {/* Confirmer mot de passe */}
      <div className={`input-group full-width ${errors.confirmPassword ? "has-error" : ""}`}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword" value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Confirmer le mot de passe</label>
        <span className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          <i className={`fas ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
        </span>
        {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Création en cours..." : "Créer mon compte Donneur"}
      </button>

      <div className="form-footer">
        Déjà inscrit ? <a href="#">Se connecter</a>
      </div>

    </form>
  );
}