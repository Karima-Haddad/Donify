import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDonorProfil,
  updateDonorProfil,
  DonorProfil,
} from "../services/profilService";
import "../styles/editprofildonor.css";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function DonorProfileEdit() {
  const donorId = localStorage.getItem("userId");
  const navigate = useNavigate();

  type DonorData = DonorProfil["donor"];

  const [donor, setDonor] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    availability: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!donorId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getDonorProfil(donorId);
        setDonor(data.donor);

        const nameParts = data.donor.name?.split(" ") || [];

        setFormData({
          firstName: nameParts.slice(1).join(" ") || "",
          lastName: nameParts[0] || "",
          email: data.donor.email || "",
          phone: data.donor.contact_phone || "",
          city: data.donor.location?.city || "",
          availability: data.donor.availability,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [donorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

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

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!donorId) {
      toast.error("Utilisateur introuvable");
      return;
    }

    if (!formData.firstName.trim()) {
      toast.error("Prénom obligatoire");
      return;
    }

    if (!formData.lastName.trim()) {
      toast.error("Nom obligatoire");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      toast.error("Email obligatoire");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Format email invalide");
      return;
    }

    const phoneRegex = /^(\+216)?[0-9]{8}$/;
    if (!formData.phone.trim()) {
      toast.error("Téléphone obligatoire");
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Numéro invalide : 8 chiffres ou +216XXXXXXXX");
      return;
    }

    if (!formData.currentPassword.trim()) {
      toast.error("Le mot de passe actuel est obligatoire");
      return;
    }

    if (
      formData.newPassword.trim() === "" &&
      formData.confirmPassword.trim() !== ""
    ) {
      toast.error("Veuillez saisir le nouveau mot de passe");
      return;
    }

    if (formData.newPassword.trim() !== "") {
      if (formData.newPassword.length < 8) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      availability: formData.availability,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword.trim(),
    };

    try {
      await updateDonorProfil(donorId, payload);
      toast.success("Profil mis à jour avec succès 🎉");

      setTimeout(() => {
        navigate("/donor-profil");
      }, 1800);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Erreur lors de la mise à jour du profil"
      );
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!donor) return <div>Donneur introuvable</div>;

  return (
    <div className="container">
      <div className="page-title">
        <h1>Modifier Profil</h1>
        <p>Mettez à jour vos informations personnelles.</p>
      </div>

      <div className="form-card">
        <div className="form-grid">
          <div className="input-group">
            <label>Prénom</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Nom</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Téléphone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: 12345678 ou +21612345678"
              required
            />
          </div>

          <div className="input-group">
            <label>Ville</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Groupe sanguin</label>
            <input value={donor.blood_type} disabled />
          </div>

          <div className="input-group">
            <label>Disponibilité</label>
            <label className="switch">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <hr />

        <h3>Sécurité</h3>

        <div className="form-grid">
          <div className="input-group">
            <label>Mot de passe actuel *</label>
            <div className="password-field">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <span
                className="password-icon"
                onClick={() => setShowCurrent((prev) => !prev)}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Nouveau mot de passe</label>
            <div className="password-field">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Laisser vide pour ne pas changer"
              />
              <span
                className="password-icon"
                onClick={() => setShowNew((prev) => !prev)}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmer le nouveau mot de passe</label>
            <div className="password-field">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Remplir si vous changez le mot de passe"
              />
              <span
                className="password-icon"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn-save" onClick={handleSubmit}>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorProfileEdit;