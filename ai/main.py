"""
Donify AI Service - FastAPI Application
---------------------------------
Ce service expose deux endpoints principaux :
1) /predict-shortage : Prédit le risque de pénurie de sang pour un h
ôpital donné, en utilisant un modèle de classification entraîné.
2) /predict-topk : Prédit les probabilités d'acceptation pour une liste de donneurs candidats et retourne les TOP-K meilleurs.
Il utilise un modèle XGBoost pour le matching et pour la prédiction de pénurie.
"""

import os
import json
import joblib
import pandas as pd

from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, Header, HTTPException

from services.topk_matching import predict_top_k


# =========================
# Charger .env
# =========================
load_dotenv()
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")

if not INTERNAL_API_KEY:
    raise ValueError("INTERNAL_API_KEY est manquant dans le fichier .env")


# =========================
# App Initialization
# =========================
app = FastAPI(
    title="Donify AI Service",
    version="1.0.0"
)


# =========================
# Paths modèles
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

SHORTAGE_MODEL_PATH = os.path.join(MODEL_DIR, "shortage_model.joblib")
BLOOD_ENCODER_PATH = os.path.join(MODEL_DIR, "blood_type_encoder.joblib")
SHORTAGE_FEATURES_PATH = os.path.join(BASE_DIR, "shortage_model_features.json")


# =========================
# Charger le modèle shortage et l'encodeur
# =========================
try:
    shortage_model = joblib.load(SHORTAGE_MODEL_PATH)
    blood_encoder = joblib.load(BLOOD_ENCODER_PATH)

    with open(SHORTAGE_FEATURES_PATH, "r", encoding="utf-8") as f:
        SHORTAGE_FEATURES = json.load(f)

    print("✅ Modèle shortage et encodeurs chargés avec succès.")

except Exception as e:
    print("❌ Erreur lors du chargement des fichiers du modèle shortage :", str(e))
    raise e


# ==========================================
# Features du modèle Matching
# ==========================================
MATCHING_FEATURES = [
    "gender",
    "donor_blood_type",
    "age",
    "distance_km",
    "days_since_last_donation",
    "never_donated",
    "donor_reliability",
    "fatigue_score",
    "notified_hour",
    "notified_weekday",
]


# ==========================================
# Request Schemas
# ==========================================
class ShortageInput(BaseModel):
    blood_type: str
    total_requested_bags: int
    total_donated_bags: int
    gap_bags: int
    current_stock_bags: int
    stock_coverage_days: float
    month: int
    is_weekend: int
    is_summer: int
    is_ramadan_like: int
    req_7d: int
    don_7d: int


class PredictTopKRequest(BaseModel):
    candidates: list[dict]
    k: int = 100


# ==========================================
# Health Check Endpoint
# ==========================================
@app.get("/health")
def health(x_api_key: str = Header(None)):
    if x_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")

    return {
        "status": "ok",
        "service": "Donify ML Service",
        "models_loaded": {
            "shortage_model": True,
            "blood_encoder": True
        }
    }


# ==========================================
# Shortage Prediction Endpoint
# ==========================================
@app.post("/predict-shortage")
def predict_shortage(data: List[ShortageInput], x_api_key: str = Header(None)):
    if x_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not data:
        raise HTTPException(status_code=400, detail="La liste des données est vide.")

    try:
        df = pd.DataFrame([item.dict() for item in data])

        required_columns = [
            "blood_type",
            "total_requested_bags",
            "total_donated_bags",
            "gap_bags",
            "current_stock_bags",
            "stock_coverage_days",
            "month",
            "is_weekend",
            "is_summer",
            "is_ramadan_like",
            "req_7d",
            "don_7d"
        ]

        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Colonnes manquantes : {missing_columns}"
            )

        unknown_blood_types = set(df["blood_type"]) - set(blood_encoder.classes_)
        if unknown_blood_types:
            raise HTTPException(
                status_code=400,
                detail=f"Groupes sanguins inconnus : {list(unknown_blood_types)}"
            )

        df["blood_type_encoded"] = blood_encoder.transform(df["blood_type"])

        missing_feature_columns = [col for col in SHORTAGE_FEATURES if col not in df.columns]
        if missing_feature_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Features shortage manquantes : {missing_feature_columns}"
            )

        X = df[SHORTAGE_FEATURES]

        predicted_labels = shortage_model.predict(X)
        predicted_probas = shortage_model.predict_proba(X)[:, 1]

        results = []
        for i, row in df.iterrows():
            prob = float(predicted_probas[i])

            if prob >= 0.75:
                risk_level = "Critique"
            elif prob >= 0.45:
                risk_level = "Modéré"
            else:
                risk_level = "Faible"

            results.append({
                "blood_type": row["blood_type"],
                "risk_probability": round(prob, 4),
                "predicted_label": int(predicted_labels[i]),
                "risk_level": risk_level
            })

        return results

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur prédiction shortage : {str(e)}")


# ==========================================
# Top-K Prediction Endpoint
# ==========================================
@app.post("/predict-topk")
def predict_topk(payload: PredictTopKRequest, x_api_key: str = Header(None)):
    if x_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not payload.candidates:
        raise HTTPException(status_code=400, detail="Candidates list is empty")

    df = pd.DataFrame(payload.candidates)

    missing = [c for c in MATCHING_FEATURES if c not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {missing}"
        )

    try:
        result_df = predict_top_k(df, k=payload.k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return result_df.to_dict(orient="records")

