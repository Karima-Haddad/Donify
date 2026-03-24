import { useEffect, useState } from "react";
import BloodShortageCard from "./BloodShortageCard";
import {
  fetchHospitalShortagePredictions,
  type Prediction,
} from "../api/shortage";

type CardRiskLevel = "Risque Critique" | "Risque Modéré" | "Risque Faible";

const ALL_BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

const HOSPITAL_ID = "f5dd3a9c-a553-4352-85e5-31208cf8355a";

export default function BloodShortageDashboard() {
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPredictions() {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchHospitalShortagePredictions(HOSPITAL_ID);
        setData(result.predictions);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les prédictions.");
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

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

  if (loading) {
    return <p style={{ padding: "40px" }}>Chargement...</p>;
  }

  if (error) {
    return <p style={{ padding: "40px", color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
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