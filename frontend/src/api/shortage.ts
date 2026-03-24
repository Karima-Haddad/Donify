export type Prediction = {
  blood_type: string;
  risk_probability: number;
  predicted_label: number;
  risk_level: "Critique" | "Modéré" | "Faible";
};

export type HospitalShortageResponse = {
  hospital_id: string;
  predictions: Prediction[];
};

export async function fetchHospitalShortagePredictions(
  hospitalId: string
): Promise<HospitalShortageResponse> {
  const response = await fetch("http://localhost:4000/api/shortage/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hospital_id: hospitalId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || "Erreur API");
  }

  const data: HospitalShortageResponse = await response.json();
  return data;
}