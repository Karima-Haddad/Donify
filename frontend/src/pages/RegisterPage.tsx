// src/pages/RegisterPage.tsx
import { useState } from "react";
import DonorForm from "../components/DonorForm";
import HospitalForm from "../components/HospitalForm";
import "../styles/RegisterPage.css";

// Type du rôle : uniquement "donor" ou "hospital" — pas n'importe quelle string
type Role = "donor" | "hospital";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("donor");

  return (
    <div className="register-wrapper">
      <div className="container">

        <div className="header">
          <h1>Créer votre compte Donify</h1>
          <p>
            Votre geste peut sauver des vies. Rejoignez la communauté et aidez
            à rendre le don de sang plus rapide et plus efficace en Tunisie.
          </p>
        </div>

        <div className="role-selector">
          <button
            className={`role-btn ${role === "donor" ? "active" : ""}`}
            onClick={() => setRole("donor")}
          >
            <i className="fas fa-tint"></i> Je suis Donneuse / Donneur
          </button>

          <button
            className={`role-btn ${role === "hospital" ? "active" : ""}`}
            onClick={() => setRole("hospital")}
          >
            <i className="fas fa-hospital"></i> Je représente un Hôpital
          </button>
        </div>

        {/* Les deux formulaires sont toujours montés */}
        <div className={`form-container ${role === "donor" ? "active" : ""}`}>
          <DonorForm />
        </div>

        <div className={`form-container ${role === "hospital" ? "active" : ""}`}>
          <HospitalForm />
        </div>

      </div>
    </div>
  );
}