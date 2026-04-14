import "../styles/editprofilhospital.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHospitalProfil, updateHospitalProfil } from "../services/profilService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  governoratesList,
  getCitiesByGovernorate,
} from "../data/tunisiaLocations";

function HospitalProfileEdit() {
  const hospitalId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const cityOptions = useMemo(() => {
    return getCitiesByGovernorate(formData.governorate);
  }, [formData.governorate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hospitalId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getHospitalProfil(hospitalId);

        if (data?.hospital) {
          setFormData((prev) => ({
            ...prev,
            name: data.hospital.name || "",
            email: data.hospital.email || "",
            phone: data.hospital.contact_phone || data.hospital.phone || "",
            governorate:
              data.hospital.location?.governorate ||
              data.hospital.governorate ||
              "",
            city: data.hospital.location?.city || data.hospital.city || "",
            address: data.hospital.address || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let cleaned = value.replace(/[^\d+]/g, "");

      if ((cleaned.match(/\+/g) || []).length > 1) return;
      if (cleaned.includes("+") && !cleaned.startsWith("+")) return;

      if (cleaned.startsWith("+216")) {
        cleaned = cleaned.slice(0, 12);
      } else {
        cleaned = cleaned.slice(0, 8);
      }

      setFormData((prev) => ({
        ...prev,
        phone: cleaned,
      }));
      return;
    }

    if (name === "governorate") {
      setFormData((prev) => ({
        ...prev,
        governorate: value,
        city: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!hospitalId) {
      toast.error("Utilisateur introuvable");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Le nom de l’établissement est obligatoire");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      toast.error("Email obligatoire");
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Format email invalide");
      return;
    }

    const phoneRegex = /^(\+216)?[0-9]{8}$/;
    if (!formData.phone.trim()) {
      toast.error("Téléphone obligatoire");
      return;
    }
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("Numéro invalide : 8 chiffres ou +216XXXXXXXX");
      return;
    }

    if (!formData.currentPassword.trim()) {
      toast.error("Le mot de passe actuel est obligatoire");
      return;
    }

    if (formData.newPassword.trim() === "" && formData.confirmPassword.trim() !== "") {
      toast.error("Veuillez saisir le nouveau mot de passe");
      return;
    }

    if (formData.newPassword.trim() !== "") {
      if (formData.newPassword.length < 8) {
        toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      governorate: formData.governorate || null,
      city: formData.city || null,
      address: formData.address.trim() || null,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword.trim(),
    };

    try {
      await updateHospitalProfil(hospitalId, payload);

      toast.success("Profil mis à jour avec succès 🎉");

      setTimeout(() => {
        navigate("/hospital-profil");
      }, 1600);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Erreur lors de la mise à jour du profil"
      );
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container-section">
      <div className="page-title">
        <h1>Modifier Profil Hôpital</h1>
        <p>Mettre à jour les informations institutionnelles.</p>
      </div>

      <div className="form-card">
        <div className="form-grid">
          <div className="input-group">
            <label>Nom établissement *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Téléphone *</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: 12345678 ou +21612345678"
              required
            />
          </div>

          <div className="input-group">
            <label>Gouvernorat</label>
            <select
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
            >
              <option value="">Sélectionner un gouvernorat</option>
              {governoratesList.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Ville</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.governorate}
            >
              <option value="">Sélectionner une ville</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Adresse</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Optionnelle"
            />
          </div>
        </div>

        <hr />

        <h3 className="full-width">Sécurité</h3>

        <div className="form-grid">
          <div className="input-group">
            <label>Mot de passe actuel *</label>
            <div className="password-field">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <span
                className="password-icon"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Nouveau mot de passe</label>
            <div className="password-field">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Laisser vide pour ne pas changer"
              />
              <span
                className="password-icon"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmer le nouveau mot de passe</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="À remplir si vous changez le mot de passe"
              />
              <span
                className="password-icon"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={handleSubmit}>
            Enregistrer
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/hospital-profil")}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default HospitalProfileEdit;