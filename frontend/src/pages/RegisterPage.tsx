// src/pages/RegisterPage.tsx
import { useState } from "react";
import DonorForm from "../components/DonorForm";
import HospitalForm from "../components/HospitalForm";
import SuccessPopup from "../components/SuccessPopup";
import "../styles/RegisterPage.css";

type Role = "donor" | "hospital";

export interface SuccessData {
  role: Role;
  name: string;
  bloodType?: string;
  nextEligibleDate?: string;
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("donor");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

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

        <div className={`form-container ${role === "donor" ? "active" : ""}`}>
          <DonorForm onSuccess={(data) => setSuccessData(data)} />
        </div>

        <div className={`form-container ${role === "hospital" ? "active" : ""}`}>
          <HospitalForm onSuccess={(data) => setSuccessData(data)} />
        </div>

      </div>

      {successData && (
        <SuccessPopup
          data={successData}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
}