# ==========================================
# Donify ML Service - FastAPI
# ==========================================

import os
import pandas as pd
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, Header, HTTPException
from services.topk_matching import predict_top_k


# =========================
# Charger .env
# =========================
load_dotenv()
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")


# ==========================================
# App Initialization
# ==========================================

app = FastAPI(
    title="Donify ML Service",
    version="1.0.0",
    description="Blood Donor Top-K Matching Service"
)


# ==========================================
# Constants
# ==========================================

FEATURES = [
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
# Request Schema
# ==========================================

class PredictTopKRequest(BaseModel):
    candidates: list[dict]
    k: int = 100


# ==========================================
# Health Check Endpoint
# ==========================================

@app.get("/health")
def health(x_api_key: str = Header(None)):

    # Vérification de la clé API pour les endpoints internes
    if x_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    return {
        "status": "ok",
        "service": "Donify ML Service",
        "model": "XGBoost Top-K Ranking"
    }


# ==========================================
# Top-K Prediction Endpoint
# ==========================================

@app.post("/predict-topk")
def predict_topk(payload: PredictTopKRequest, x_api_key: str = Header(None)):

    # Vérification de la clé API pour les endpoints internes
    if x_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not payload.candidates:
        raise HTTPException(status_code=400, detail="Candidates list is empty")

    # Convert to DataFrame
    df = pd.DataFrame(payload.candidates)

    # Check required columns
    missing = [c for c in FEATURES if c not in df.columns]
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