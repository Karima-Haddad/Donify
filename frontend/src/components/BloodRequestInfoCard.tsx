/**
 * Ce composant affiche les détails d’une demande de sang
 */

import "../styles/BloodRequestInfoCard.css";

type Props = {
  request: {
    quantity?: number | null;
    needed_date?: string | null;
    city?: string | null;
    service?: string | null;
    notes?: string | null;
  };
};

export default function BloodRequestInfoCard({ request }: Props) {
  
  // 🔹 Helper pour afficher une valeur ou fallback
  const display = (value: any, suffix = "") => {
    if (value === null || value === undefined || value === "") {
      return "Non renseigné";
    }
    return `${value}${suffix}`;
  };

  // 🔹 Gestion sécurisée de la date
  const formatDate = (date?: string | null) => {
    if (!date) return "Non renseigné";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Non renseigné";

    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="request-card">
      <h2 className="request-card__title">Informations de la demande</h2>

      <div className="request-card__grid">
        <div className="request-card__item">
          <span className="label">Quantité</span>
          <span className="value">{display(request.quantity, " unités")}</span>
        </div>

        <div className="request-card__item">
          <span className="label">Date souhaitée</span>
          <span className="value">{formatDate(request.needed_date)}</span>
        </div>

        <div className="request-card__item">
          <span className="label">Ville</span>
          <span className="value">{display(request.city)}</span>
        </div>

        <div className="request-card__item">
          <span className="label">Service</span>
          <span className="value">{display(request.service)}</span>
        </div>
      </div>

      <div className="request-card__notes">
        <span className="label">Notes</span>
        <p>{display(request.notes)}</p>
      </div>
    </div>
  );
}