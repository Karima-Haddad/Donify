// src/components/HospitalForm.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerHospital } from "../services/auth-Service";
import {
  governoratesList,
  getCitiesByGovernorate,
  getCoordinates
} from "../data/tunisiaLocations";

// ── Type de l'état du formulaire ──────────────────────────────────────────
interface HospitalFormState {
  name: string;
  responsible_name: string;
  email: string;
  contact_phone: string;
  city: string;
  governorate: string;
  password: string;
  confirmPassword: string;
}

const initialState: HospitalFormState = {
  name: "", responsible_name: "", email: "",
  contact_phone: "", city: "", governorate: "",
  password: "", confirmPassword: ""
};

export default function HospitalForm(): React.ReactElement {
  const [formData, setFormData] = useState<HospitalFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof HospitalFormState, string>>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const cities: string[] = getCitiesByGovernorate(formData.governorate);

  const tunisianPhoneRegex = /^[0-9]{8}$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // ── Gestion des changements ───────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    if (name === "governorate") {
      setFormData(prev => ({ ...prev, governorate: value, city: "" }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Validation d'un seul champ ────────────────────────────────────────
  const validateField = (name: string, value: string): void => {
    let error = "";

    if (name === "name" && !value.trim()) error = "Le nom de l'établissement est requis";
    if (name === "responsible_name" && !value.trim()) error = "Le nom du responsable est requis";
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) error = "Email invalide";
    if (name === "contact_phone" && !tunisianPhoneRegex.test(value))
      error = "Le numéro doit contenir exactement 8 chiffres";
    if (name === "governorate" && !value) error = "Le gouvernorat est requis";
    if (name === "city" && !value) error = "La ville est requise";
    if (name === "password" && !strongPasswordRegex.test(value))
      error = "Mot de passe faible (8 caractères min, maj, min, chiffre, symbole)";
    if (name === "confirmPassword" && value !== formData.password)
      error = "Les mots de passe ne correspondent pas";

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // ── Touche Entrée ─────────────────────────────────────────────────────
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      validateField(target.name, target.value);
      target.focus();
    }
  };

  // ── Validation complète au submit ─────────────────────────────────────
  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof HospitalFormState, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Le nom de l'établissement est requis";
    if (!formData.responsible_name.trim()) newErrors.responsible_name = "Le nom du responsable est requis";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!tunisianPhoneRegex.test(formData.contact_phone))
      newErrors.contact_phone = "Le numéro doit contenir exactement 8 chiffres";
    if (!formData.governorate) newErrors.governorate = "Le gouvernorat est requis";
    if (!formData.city) newErrors.city = "La ville est requise";
    if (!strongPasswordRegex.test(formData.password))
      newErrors.password = "Mot de passe faible (8 caractères min, maj, min, chiffre, symbole)";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    try {
      const { latitude, longitude } = getCoordinates(formData.governorate, formData.city);

      await registerHospital({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact_phone: `+216${formData.contact_phone}`,
        city: formData.city,
        governorate: formData.governorate,
        latitude,
        longitude
      });

      alert("Compte créé avec succès !");
      setFormData(initialState);
      setErrors({});
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">

      {/* Nom établissement */}
      <div className={`input-group full-width ${errors.name ? "has-error" : ""}`}>
        <input type="text" name="name" value={formData.name}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Nom de l'établissement</label>
        {errors.name && <small className="error">{errors.name}</small>}
      </div>

      {/* Responsable */}
      <div className={`input-group ${errors.responsible_name ? "has-error" : ""}`}>
        <input type="text" name="responsible_name" value={formData.responsible_name}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Nom du responsable</label>
        {errors.responsible_name && <small className="error">{errors.responsible_name}</small>}
      </div>

      {/* Email */}
      <div className={`input-group ${errors.email ? "has-error" : ""}`}>
        <input type="email" name="email" value={formData.email}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown} placeholder=" " />
        <label className="floating-label">Email professionnel</label>
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

      {/* Gouvernorat */}
      <div className={`input-group ${errors.governorate ? "has-error" : ""}`}>
        <label className="select-label">Gouvernorat</label>
        <select name="governorate" value={formData.governorate}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          onKeyDown={handleKeyDown}>
          <option value="">Sélectionner</option>
          {governoratesList.map(gov => (
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
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {errors.city && <small className="error">{errors.city}</small>}
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
        {loading ? "Création en cours..." : "Créer le compte Hôpital"}
      </button>

      <div className="form-footer">
        Déjà inscrit ? <Link to="/login">Se connecter</Link>
      </div>

    </form>
  );
}