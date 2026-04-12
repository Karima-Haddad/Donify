import BloodShortageCard from "./BloodShortageCard";
import type { Prediction } from "../api/shortage";

type CardRiskLevel = "Risque Critique" | "Risque Modéré" | "Risque Faible";

const ALL_BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

type Props = {
  data: Prediction[];
};

export default function BloodShortageDashboard({ data }: Props) {
  const estimateDays = (risk: number) => {
    return Math.max(1, Math.round((1 - risk) * 14));
  };

  const mapRiskLabel = (label?: string): CardRiskLevel => {
    switch ((label ?? "").trim()) {
      case "Critique":
        return "Risque Critique";
      case "Modéré":
        return "Risque Modéré";
      case "Faible":
        return "Risque Faible";
      default:
        return "Risque Faible";
    }
  };

  return (
    <div
      style={{
        padding: "0px",
        backgroundColor: "#f5f7fa",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            color: "#1E3A5F",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Risque de pénurie
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {ALL_BLOOD_TYPES.map((type) => {
            const prediction = data.find((p) => p.blood_type === type);

            if (!prediction) {
              return (
                <BloodShortageCard
                  key={type}
                  bloodType={type}
                  riskLevel="Risque Faible"
                  estimatedDays={14}
                />
              );
            }

            return (
              <BloodShortageCard
                key={type}
                bloodType={type}
                riskLevel={mapRiskLabel(prediction.risk_level)}
                estimatedDays={estimateDays(prediction.risk_probability)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}