import React from "react";

type Props = {
  bloodType: string;
  riskLevel: "Risque Critique" | "Risque Modéré" | "Risque Faible";
  estimatedDays?: number;
};

const riskStyles = {
  "Risque Critique": {
    background: "#FEE2E2",
    color: "#B91C1C",
  },
  "Risque Modéré": {
    background: "#FEF3C7",
    color: "#92400E",
  },
  "Risque Faible": {
    background: "#D1FAE5",
    color: "#065F46",
  },
};

const BloodShortageCard: React.FC<Props> = ({
  bloodType,
  riskLevel,
  estimatedDays,
}) => {
  const style = riskStyles[riskLevel];

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
        width: "280px",
        backgroundColor: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          marginBottom: "12px",
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        Groupe {bloodType}
      </h3>

      <span
        style={{
          backgroundColor: style.background,
          color: style.color,
          padding: "6px 12px",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        {riskLevel}
      </span>

      <p
        style={{
          marginTop: "14px",
          color: "#4b5563",
          fontSize: "14px",
        }}
      >
        {riskLevel === "Risque Faible"
          ? "Stock stable pour les 3 prochaines semaines."
          : `Risque estimé de rupture : ${estimatedDays} jours`}
      </p>
    </div>
  );
};

export default BloodShortageCard;