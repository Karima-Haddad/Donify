import os
import joblib
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

# =========================
# App Initialization
# =========================
app = FastAPI(
    title="Donify ML Service",
    version="1.0.0",
    description="Blood Donor Top-K Matching Service"
)

# =========================
# Paths modèles
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model", "shortage_model.pkl")
encoder_path = os.path.join(BASE_DIR, "model", "blood_type_encoder.pkl")

# =========================
# Charger le modèle et l'encodeur
# =========================
model = joblib.load(model_path)
encoder = joblib.load(encoder_path)

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
# Request Schemas
# ==========================================
class PredictRequest(BaseModel):
    total_requested_bags: float
    total_donated_bags: float
    gap_bags: float
    month: int
    is_weekend: int
    is_summer: int
    is_ramadan_like: int
    req_7d: float
    don_7d: float
    blood_type: str


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
        "model": "XGBoost Top-K Ranking"
    }


# ==========================================
# Shortage Prediction Endpoint
# ==========================================
@app.post("/predict")
def predict(payload: PredictRequest):
    try:
        data_dict = payload.dict()
        df = pd.DataFrame([data_dict])

        df["blood_type_encoded"] = encoder.transform([df["blood_type"][0]])

        features = [
            "total_requested_bags",
            "total_donated_bags",
            "gap_bags",
            "month",
            "is_weekend",
            "is_summer",
            "is_ramadan_like",
            "req_7d",
            "don_7d",
            "blood_type_encoded"
        ]

        missing_cols = [f for f in features if f not in df.columns]
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Colonnes manquantes: {missing_cols}"
            )

        prediction = model.predict(df[features])[0]
        probability = model.predict_proba(df[features])[0][1]

        return {
            "shortage_predicted": int(prediction),
            "risk_probability": float(probability)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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





# import os
# import joblib
# import pandas as pd
# from dotenv import load_dotenv
# from pydantic import BaseModel
# from flask import Flask, request, jsonify
# from fastapi import FastAPI, Header, HTTPException
# from services.topk_matching import predict_top_k


# # =========================
# # Charger .env
# # =========================
# load_dotenv()
# INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")



# # ==========================================
# # App Initialization
# # ==========================================

# app = FastAPI(
#     title="Donify ML Service",
#     version="1.0.0",
#     description="Blood Donor Top-K Matching Service"
# )

# # =========================
# # Setup Flask
# # =========================
# app = Flask(__name__)

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# model_path = os.path.join(BASE_DIR, "model", "shortage_model.pkl")
# encoder_path = os.path.join(BASE_DIR, "model", "blood_type_encoder.pkl")

# # Charger le modèle et l'encodeur
# # model = joblib.load(model_path)                       ##Nour
# # encoder = joblib.load(encoder_path)                    ##NOUR

# # =========================
# # Endpoint prediction
# # =========================
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data_dict = request.json
#         # Vérification basique
#         if not data_dict:
#             return jsonify({"error": "Aucune donnée reçue"}), 400

#         # Conversion en DataFrame
#         df = pd.DataFrame([data_dict])

#         # Encoder blood_type
#         if "blood_type" not in df.columns:
#             return jsonify({"error": "blood_type manquant"}), 400

#         df["blood_type_encoded"] = encoder.transform([df["blood_type"][0]])

#         # Sélection des features pour le modèle
#         features = [
#             "total_requested_bags",
#             "total_donated_bags",
#             "gap_bags",
#             "month",
#             "is_weekend",
#             "is_summer",
#             "is_ramadan_like",
#             "req_7d",
#             "don_7d",
#             "blood_type_encoded"
#         ]

#         # Vérification des colonnes manquantes
#         missing_cols = [f for f in features if f not in df.columns]
#         if missing_cols:
#             return jsonify({"error": f"Colonnes manquantes: {missing_cols}"}), 400

#         # Prédiction
#         prediction = model.predict(df[features])[0]
#         probability = model.predict_proba(df[features])[0][1]

#         return jsonify({
#             "shortage_predicted": int(prediction),
#             "risk_probability": float(probability)
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



# # ==========================================
# # Constants
# # ==========================================

# FEATURES = [
#     "gender",
#     "donor_blood_type",
#     "age",
#     "distance_km",
#     "days_since_last_donation",
#     "never_donated",
#     "donor_reliability",
#     "fatigue_score",
#     "notified_hour",
#     "notified_weekday",
# ]


# # ==========================================
# # Request Schema
# # ==========================================

# class PredictTopKRequest(BaseModel):
#     candidates: list[dict]
#     k: int = 100


# # ==========================================
# # Health Check Endpoint
# # ==========================================

# @app.get("/health")
# def health(x_api_key: str = Header(None)):

#     # Vérification de la clé API pour les endpoints internes
#     if x_api_key != INTERNAL_API_KEY:
#         raise HTTPException(status_code=403, detail="Unauthorized")
        
#     return {
#         "status": "ok",
#         "service": "Donify ML Service",
#         "model": "XGBoost Top-K Ranking"
#     }


# # ==========================================
# # Top-K Prediction Endpoint
# # ==========================================

# @app.post("/predict-topk")
# def predict_topk(payload: PredictTopKRequest, x_api_key: str = Header(None)):

#     # Vérification de la clé API pour les endpoints internes
#     if x_api_key != INTERNAL_API_KEY:
#         raise HTTPException(status_code=403, detail="Unauthorized")

#     if not payload.candidates:
#         raise HTTPException(status_code=400, detail="Candidates list is empty")

#     # Convert to DataFrame
#     df = pd.DataFrame(payload.candidates)

#     # Check required columns
#     missing = [c for c in FEATURES if c not in df.columns]
#     if missing:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Missing required columns: {missing}"
#         )

#     try:
#         result_df = predict_top_k(df, k=payload.k)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

#     return result_df.to_dict(orient="records")


# # =========================
# # Lancement du serveur Flask
# # =========================
# if __name__ == "__main__":
#     # Activation debug pour développement
#     app.run(host='0.0.0.0', port=8000, debug=True)