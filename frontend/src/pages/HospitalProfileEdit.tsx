import "../styles/hospital.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHospitalProfil, updateHospitalProfil } from "../services/profilService";

function HospitalProfileEdit() {
  const hospitalId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    responsible: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ GET DATA
  useEffect(() => {
    const fetchData = async () => {
      if (!hospitalId) return;

      try {
        const data = await getHospitalProfil(hospitalId);

        if (data?.hospital) {
          setFormData((prev) => ({
            ...prev,
            name: data.hospital.name,
            email: data.hospital.email,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  // ✅ HANDLE CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      await updateHospitalProfil(hospitalId!, formData);
      alert("Profil mis à jour !");
      navigate("/hospital-profil");
    } catch (err) {
      console.error(err);
      alert("Erreur mise à jour");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container">
      <div className="page-title">
        <h1>Modifier Profil Hôpital</h1>
        <p>Mettre à jour les informations institutionnelles.</p>
      </div>

      <div className="form-card">
        <div className="form-grid">

          <div className="input-group">
            <label>Nom établissement</label>
            <input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Responsable</label>
            <input name="responsible" value={formData.responsible} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Téléphone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Ville</label>
            <input name="city" value={formData.city} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Adresse</label>
            <input name="address" value={formData.address} onChange={handleChange} />
          </div>

          <h3 className="full-width" style={{ marginTop: "20px" }}>
            Sécurité
          </h3>

          <div className="input-group full-width">
            <label>Mot de passe actuel</label>
            <input type="password" name="currentPassword" onChange={handleChange} />
          </div>

          <div className="input-group full-width">
            <label>Nouveau mot de passe</label>
            <input type="password" name="newPassword" onChange={handleChange} />
          </div>

          <div className="input-group full-width">
            <label>Confirmer mot de passe</label>
            <input type="password" name="confirmPassword" onChange={handleChange} />
          </div>

        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={handleSubmit}>
            Enregistrer
          </button>

          <button className="btn-secondary" onClick={() => navigate("/hospital-profil")}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default HospitalProfileEdit;
