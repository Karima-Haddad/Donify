"""
Donify - TOP-K Matching Service
---------------------------------
- Charge le modèle XGBoost sauvegardé (pipeline complet)
- Prédit la probabilité d'acceptation pour chaque donneur candidat
- Retourne les TOP-K donneurs à contacter

Entrée typique : un CSV / DataFrame avec les colonnes:
gender, donor_blood_type, age, distance_km, days_since_last_donation,
never_donated, donor_reliability, fatigue_score, notified_hour, notified_weekday
"""

import os
import pandas as pd
from joblib import load


# =========================
# Paramètres
# =========================

MODEL_PATH = os.path.join("models", "xgboost.joblib")

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
    "notified_weekday"
]


def predict_top_k(df_candidates: pd.DataFrame, k: int = 100) -> pd.DataFrame:
    """
    Prend un DataFrame de candidats et renvoie les k meilleurs donneurs.
    Retourne le DataFrame trié avec une colonne 'proba_accept'.
    """

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Modèle introuvable: {MODEL_PATH}")

    # Vérifier les colonnes nécessaires
    missing = [c for c in FEATURES if c not in df_candidates.columns]
    if missing:
        raise ValueError(f"Colonnes manquantes dans les candidats: {missing}")

    # Charger pipeline (preprocess + modèle)
    pipe = load(MODEL_PATH)

    # Prédire probabilités
    X = df_candidates[FEATURES].copy()
    proba = pipe.predict_proba(X)[:, 1]

    # Ajouter scores et trier
    out = df_candidates.copy()
    out["proba_accept"] = proba 
    out = out.sort_values("proba_accept", ascending=False)

    # Retourner TOP-K
    return out.head(k)



# Test de ranking 
if __name__ == "__main__":
    # Exemple simple: charger un fichier de candidats (à toi de le créer)
    # candidates.csv doit contenir au moins les colonnes FEATURES
    candidates_path = os.path.join("data", "candidates.csv")

    if not os.path.exists(candidates_path):
        print("⚠️ Exemple: crée data/candidates.csv pour tester.")
    else:
        df_candidates = pd.read_csv(candidates_path)
        topk = predict_top_k(df_candidates, k=50)
        print(topk.head(10))