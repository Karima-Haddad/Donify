// src/components/SuccessPopup.tsx
import { useNavigate } from "react-router-dom";
import type { SuccessData } from "../pages/RegisterPage";
import "../styles/SuccessPopup.css";

interface Props {
  data: SuccessData;
  onClose: () => void;
}

export default function SuccessPopup({ data, onClose }: Props) {
  const navigate = useNavigate();
  const isDonor = data.role === "donor";

  const handleLogin = () => {
    onClose();
    navigate("/");
  };

  return (
    <div className="sp-overlay">
      <div className={`sp-card ${isDonor ? "sp-card--donor" : "sp-card--hospital"}`}>

        {/* Icône */}
        <div className={`sp-icon ${isDonor ? "sp-icon--donor" : "sp-icon--hospital"}`}>
          {isDonor
            ? <i className="fas fa-tint"></i>
            : <i className="fas fa-hospital"></i>
          }
        </div>

        {/* Titre */}
        <h2 className="sp-title">
          {isDonor
            ? `Bienvenue, ${data.name} !`
            : "Inscription réussie !"
          }
        </h2>

        {/* Sous-titre */}
        <p className="sp-subtitle">
          {isDonor
            ? "Votre compte donneur a bien été créé"
            : `Compte créé pour ${data.name}`
          }
        </p>

        {/* Badge */}
        {isDonor && data.bloodType && (
          <span className="sp-badge sp-badge--donor">
            <i className="fas fa-tint" style={{ marginRight: 6, fontSize: 11 }}></i>
            Groupe sanguin · {data.bloodType}
          </span>
        )}
        {!isDonor && (
          <span className="sp-badge sp-badge--hospital">
            <i className="fas fa-hospital" style={{ marginRight: 6, fontSize: 11 }}></i>
            Établissement hospitalier
          </span>
        )}

        {/* Séparateur */}
        <div className="sp-divider"></div>

        {/* Message personnalisé */}
        <p className="sp-message">
          {isDonor ? (
            <>
              Merci de rejoindre la communauté Donify.
              {data.nextEligibleDate && (
                <>
                  {" "}Votre prochain don sera possible à partir du{" "}
                  <strong>{data.nextEligibleDate}</strong>.
                </>
              )}
            </>
          ) : (
            <>
              Merci de faire confiance à Donify. Vous pouvez maintenant vous
              connecter pour publier vos <strong>demandes de sang</strong> et
              gérer vos besoins en transfusion.
            </>
          )}
        </p>

        {/* Note connexion requise */}
        <div className="sp-notice">
          <i className="fas fa-info-circle" style={{ marginRight: 8, fontSize: 13 }}></i>
          Connectez-vous pour accéder à votre espace
        </div>

        {/* Bouton principal */}
        <button
          className={`sp-btn ${isDonor ? "sp-btn--donor" : "sp-btn--hospital"}`}
          onClick={handleLogin}
        >
          <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }}></i>
          Se connecter
        </button>

        {/* Lien fermeture */}
        <button className="sp-close-link" onClick={onClose}>
          Rester sur la page d'inscription
        </button>

      </div>
    </div>
  );
}