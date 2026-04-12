import { useState, useEffect } from "react";
import { getDonorProfil, updateDonorProfil, DonorProfil } from "../services/profilService";
import "../styles/editprofildonor.css";


function DonorProfileEdit() {
  const donorId = localStorage.getItem("userId");

  // On utilise directement le type du donor, pas DonorProfil entier
  type DonorData = DonorProfil["donor"];
  const [donor, setDonor] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    lastDonation: "",
    availability: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!donorId) return;
      setLoading(true);
      try {
        const data = await getDonorProfil(donorId);
        setDonor(data.donor);
        setFormData({
          firstName: data.donor.name.split(" ")[1] || "",
          lastName: data.donor.name.split(" ")[0] || "",
          email: data.donor.email,
          phone: data.donor.contact_phone || "",
          city: data.donor.location?.city || "",
          lastDonation: data.donor.last_donation_date || "",
          availability: data.donor.availability,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [donorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      await updateDonorProfil(donorId!, formData);
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!donor) return <div>Donor introuvable</div>;

  return (
    <div className="container">
      <div className="page-title">
        <h1>Modifier Profil</h1>
        <p>Mettez à jour vos informations personnelles et votre disponibilité.</p>
      </div>

      <div className="form-card">
        <div className="form-grid">
          <div className="input-group">
            <label>Prénom</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Nom</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} />
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
            <label>Date dernier don</label>
            <input type="date" name="lastDonation" value={formData.lastDonation} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Groupe sanguin</label>
            <input type="text" value={donor.blood_type} disabled />
          </div>
          <div className="input-group">
            <label>Disponibilité</label>
            <div className="toggle-wrapper">
              <label className="switch">
                <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
                <span className="slider"></span>
              </label>
              <span>Disponible pour donner</span>
            </div>
          </div>
        </div>

        <hr style={{ margin: "40px 0", border: "none", borderTop: "1px solid #E0E3E7" }} />

        <h3 style={{ marginBottom: "20px", color: "#1E3A5F" }}>Sécurité</h3>

        <div className="form-grid">
          <div className="input-group">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe actuel"
            />
          </div>
          <div className="input-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div className="input-group">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer le nouveau mot de passe"
            />
          </div>
        </div>

        <div className="button-group">
          <button className="btn-save" onClick={handleSubmit}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}

export default DonorProfileEdit;
