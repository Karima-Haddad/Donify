// src/pages/CreateBloodRequest.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createBloodRequest } from "../services/bloodRequestService";
import "../styles/CreateBloodRequest.css";

// ── Types ─────────────────────────────────────────────────────────────────
interface FormState {
  blood_type:   string;
  quantity:     string;
  desired_date: string;
  service:      string;
  notes:        string;
}

interface FormErrors {
  blood_type?:   string;
  quantity?:     string;
  desired_date?: string;
}

const initialState: FormState = {
  blood_type:   "",
  quantity:     "",
  desired_date: "",
  service:      "",
  notes:        ""
};

// Liste fixe des services hospitaliers
const HOSPITAL_SERVICES = [
  "Urgences",
  "Chirurgie",
  "Maternité",
  "Pédiatrie",
  "Réanimation",
  "Cardiologie",
  "Oncologie",
  "Orthopédie",
  "Neurologie",
  "Dialyse"
];

export default function CreateBloodRequest() {
  const [formData, setFormData]   = useState<FormState>(initialState);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [loading, setLoading]     = useState<boolean>(false);
  const [success, setSuccess]     = useState<boolean>(false);
  const navigate = useNavigate();

  // ── Gestion des changements ─────────────────────────────────────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Validation par champ ────────────────────────────────────────────────
  const validateField = (name: string, value: string): void => {
    let error = "";
    if (name === "blood_type" && !value)
      error = "Le groupe sanguin est requis";
    if (name === "quantity") {
      if (!value) error = "La quantité est requise";
      else if (isNaN(Number(value)) || Number(value) <= 0)
        error = "La quantité doit être un nombre positif";
    }
    if (name === "desired_date" && !value)
      error = "La date souhaitée est requise";
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // ── Touche Entrée ───────────────────────────────────────────────────────
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      validateField(target.name, target.value);
      target.focus();
    }
  };

  // ── Validation complète ─────────────────────────────────────────────────
  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.blood_type)
      newErrors.blood_type = "Le groupe sanguin est requis";
    if (!formData.quantity)
      newErrors.quantity = "La quantité est requise";
    else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0)
      newErrors.quantity = "La quantité doit être un nombre positif";
    if (!formData.desired_date)
      newErrors.desired_date = "La date souhaitée est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    try {
      await createBloodRequest({
        blood_type:  formData.blood_type,
        quantity:    Number(formData.quantity),
        needed_date: formData.desired_date ,  // ← envoyé au backend
        service:     formData.service      || null,  // ← envoyé au backend
        notes:       formData.notes        || null,  // ← envoyé au backend
      });
      setSuccess(true);
      setFormData(initialState);
      setErrors({});
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || "Erreur lors de la création de la demande");
    } finally {
      setLoading(false);
    }
  };

  // ── Message de succès ───────────────────────────────────────────────────
  if (success) {
    return (
      <div className="cr-wrapper">
        <div className="cr-container">
          <div className="cr-success">
            <div className="cr-success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Demande créée avec succès !</h2>
            <p>
              Votre demande de sang a été publiée. Le système de matching
              va notifier les donneurs compatibles automatiquement.
            </p>
            <div className="cr-success-buttons">
              <button className="cr-btn-primary" onClick={() => setSuccess(false)}>
                <i className="fas fa-plus"></i> Nouvelle demande
              </button>
              <button className="cr-btn-secondary" onClick={() => navigate("/hospital-dashboard-page")}>
                Retour au dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulaire ──────────────────────────────────────────────────────────
  return (
    <div className="cr-wrapper">
      <div className="cr-container">

        {/* Header */}
        <div className="cr-page-title">
          <h1><i className="fas fa-plus-circle"></i> Créer une demande</h1>
          <p>Publiez une demande de sang pour déclencher le matching intelligent.</p>
        </div>

        {/* Card */}
        <div className="cr-form-card">
          <form onSubmit={handleSubmit}>

            {/* Grille 2 colonnes */}
            <div className="cr-form-grid">

              {/* Groupe sanguin */}
              <div className={`cr-input-group ${errors.blood_type ? "has-error" : ""}`}>
                <label>Groupe sanguin</label>
                <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  onKeyDown={handleKeyDown}
                >
                  <option value="">Sélectionner</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.blood_type && <small className="cr-error">{errors.blood_type}</small>}
              </div>

              {/* Quantité */}
              <div className={`cr-input-group ${errors.quantity ? "has-error" : ""}`}>
                <label>Quantité (nombre de poches)</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex : 3 poches"
                  min="1"
                />
                {errors.quantity && <small className="cr-error">{errors.quantity}</small>}
              </div>

              {/* Date souhaitée */}
              <div className={`cr-input-group ${errors.desired_date ? "has-error" : ""}`}>
                <label>Date souhaitée</label>
                <input
                  type="date"
                  name="desired_date"
                  value={formData.desired_date}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {errors.desired_date && <small className="cr-error">{errors.desired_date}</small>}
              </div>

              {/* Service concerné — liste fixe */}
              <div className="cr-input-group">
                <label>
                  Service concerné <span className="cr-optional">(optionnel)</span>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  {HOSPITAL_SERVICES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Notes complémentaires — pleine largeur */}
            <div className="cr-input-group">
              <label>
                Notes complémentaires <span className="cr-optional">(optionnel)</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Informations importantes pour les donneurs..."
              />
            </div>

            {/* Boutons */}
            <div className="cr-button-group">
              <button type="submit" className="cr-btn-primary" disabled={loading}>
                {loading
                  ? "Publication en cours..."
                  : <><i className="fas fa-paper-plane"></i> Publier la demande</>
                }
              </button>
              <button
                type="button"
                className="cr-btn-secondary"
                onClick={() => navigate("/hospital-dashboard")}
              >
                Annuler
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}