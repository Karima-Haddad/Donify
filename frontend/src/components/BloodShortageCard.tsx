type RiskLevel = "Risque Critique" | "Risque Modéré" | "Risque Faible";

type Props = {
  bloodType: string;
  riskLevel: RiskLevel;
  estimatedDays?: number;
};

const riskStyles: Record<RiskLevel, { background: string; color: string }> = {
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


export default function BloodShortageCard({
  bloodType,
  riskLevel,
  estimatedDays,
}: Props) {
  const style = riskStyles[riskLevel] ?? riskStyles["Risque Faible"];

  return (
    <div
      style={{
        borderRadius: "16px",
        padding: "20px",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        transition: "all 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
      }}
    >
      {/* Titre */}
      <h3
        style={{
          marginBottom: "14px",
          fontWeight: 700,
          fontSize: "18px",
          color: "#1F2937",
        }}
      >
        🧬 Groupe {bloodType}
      </h3>

      {/* Badge */}
      <span
        style={{
          display: "inline-block",
          backgroundColor: style.background,
          color: style.color,
          padding: "6px 14px",
          borderRadius: "999px",
          fontWeight: 600,
          fontSize: "13px",
        }}
      >
        {riskLevel}
      </span>

      {/* Texte */}
      <p
        style={{
          marginTop: "16px",
          color: "#4b5563",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {riskLevel === "Risque Faible"
          ? "Stock stable pour les prochains jours."
          : `Risque estimé de rupture : ${estimatedDays ?? 1} jours`}
      </p>
    </div>
  );
}