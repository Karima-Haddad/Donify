import "../styles/editprofilhospital.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHospitalProfil, updateHospitalProfil } from "../services/profilService";

// 👁️ icons
import { FaEye, FaEyeSlash } from "react-icons/fa";

// 🔔 toast notifications
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HospitalProfileEdit() {
  const hospitalId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // 👁️ visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    currentPassword: "",
    newPassword: "",
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
            name: data.hospital.name || "",
            email: data.hospital.email || "",
            
          }));

          toast.success("Données chargées avec succès");
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
    try {
      await updateHospitalProfil(hospitalId!, formData);

      toast.success("Profil mis à jour avec succès 🎉");

      setTimeout(() => {
        navigate("/hospital-profil");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du profil");
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

          {/* NAME */}
          <div className="input-group">
            <label>Nom établissement</label>
            <input name="name" value={formData.name} onChange={handleChange} />
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          {/* PHONE */}
          <div className="input-group">
            <label>Téléphone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          {/* CITY */}
          <div className="input-group">
            <label>Ville</label>
            <input name="city" value={formData.city} onChange={handleChange} />
          </div>

          {/* ADDRESS */}
          <div className="input-group">
            <label>Adresse</label>
            <input name="address" value={formData.address} onChange={handleChange} />
          </div>

          {/* SECURITY */}
          <h3 className="full-width" style={{ marginTop: "20px" }}>
            Sécurité
          </h3>

          {/* CURRENT PASSWORD */}
          <div className="input-group full-width">
            <label>Mot de passe actuel</label>
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>

          {/* NEW PASSWORD */}
          <div className="input-group full-width">
            <label>Nouveau mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          {/* TOGGLE ICON */}
          <div
            onClick={togglePasswordVisibility}
            style={{
              marginTop: "10px",
              marginBottom: "20px",
              cursor: "pointer",
              color: "#1E3A5F",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              userSelect: "none",
              fontWeight: "500",
            }}
          >
            {showPassword ? (
              <>
                <FaEyeSlash /> Masquer les mots de passe
              </>
            ) : (
              <>
                <FaEye /> Afficher les mots de passe
              </>
            )}
          </div>

        </div>

        {/* BUTTONS */}
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
