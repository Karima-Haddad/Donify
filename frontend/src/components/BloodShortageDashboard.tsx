import React, { useEffect, useState } from "react";
import BloodShortageCard from "./BloodShortageCard";

type Prediction = {
  blood_type: string;
  risk_label: "Critique" | "Modéré" | "Faible";
  risk_probability: number;
};

const ALL_BLOOD_TYPES = [
  "O-",
  "O+",
  "A-",
  "A+",
  "B-",
  "B+",
  "AB-",
  "AB+",
];

const BloodShortageDashboard: React.FC = () => {
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/ai/predict-from-db")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const estimateDays = (risk: number) => {
    return Math.max(1, Math.round((1 - risk) * 14));
  };

  if (loading) return <p style={{ padding: "40px" }}>Chargement...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "30px", textAlign: "left", color: "#1E3A8A" }}>
        Prédictions IA – Risque de pénurie
      </h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {ALL_BLOOD_TYPES.map((type) => {
          const prediction = data.find((p) => p.blood_type === type);

          if (!prediction) {
            return (
              <BloodShortageCard
                key={type}
                bloodType={type}
                riskLevel="Risque Faible"
              />
            );
          }

          return (
            <BloodShortageCard
              key={type}
              bloodType={type}
              riskLevel={`Risque ${prediction.risk_label}`}
              estimatedDays={estimateDays(prediction.risk_probability)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BloodShortageDashboard;