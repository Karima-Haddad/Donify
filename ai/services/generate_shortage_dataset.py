'''
Ce script génère un dataset réaliste pour entraîner un modèle de prédiction de pénuries de sang.
'''
import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd


# =========================================================
# 1) CONFIGURATION GÉNÉRALE
# =========================================================

SEED = 42
np.random.seed(SEED)

N_DAYS = 365
N_HOSPITALS = 20
START_DATE = datetime(2024, 1, 1)

BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

OUTPUT_PATH = os.path.join(DATA_DIR, "shortage_model_dataset.csv")


# =========================================================
# 2) HÔPITAUX FIXES
# =========================================================

hospital_ids = [f"HOSPITAL_{i+1:02d}" for i in range(N_HOSPITALS)]


# =========================================================
# 3) PROFILS DES HÔPITAUX
# =========================================================
# Chaque hôpital a un profil stable :
# - taille / activité
# - capacité de collecte
# - niveau de stock initial
# - vulnérabilité structurelle
# =========================================================

hospital_profiles = {}

for hospital_id in hospital_ids:
    hospital_profiles[hospital_id] = {
        "size_factor": np.random.uniform(0.85, 1.35),          # volume global d'activité
        "collection_factor": np.random.uniform(0.80, 1.25),    # capacité à recevoir des dons
        "vulnerability_factor": np.random.uniform(0.90, 1.20), # tension structurelle
        "stock_factor": np.random.uniform(0.80, 1.30),         # niveau de stock moyen
    }


# =========================================================
# 4) PROFIL DES GROUPES SANGUINS
# =========================================================
# On distingue :
# - demande moyenne
# - disponibilité côté dons
# - criticité
# =========================================================

blood_profiles = {
    "O+":  {"demand_factor": 1.25, "donation_factor": 1.10, "criticality": 1.10},
    "O-":  {"demand_factor": 1.35, "donation_factor": 0.75, "criticality": 1.35},
    "A+":  {"demand_factor": 1.10, "donation_factor": 1.00, "criticality": 1.00},
    "A-":  {"demand_factor": 1.00, "donation_factor": 0.80, "criticality": 1.15},
    "B+":  {"demand_factor": 0.95, "donation_factor": 0.95, "criticality": 0.95},
    "B-":  {"demand_factor": 0.90, "donation_factor": 0.70, "criticality": 1.10},
    "AB+": {"demand_factor": 0.75, "donation_factor": 0.85, "criticality": 0.85},
    "AB-": {"demand_factor": 0.65, "donation_factor": 0.60, "criticality": 1.20},
}


# =========================================================
# 5) FONCTIONS UTILES
# =========================================================

def get_seasonal_demand_multiplier(month: int) -> float:
    """
    Effet saisonnier sur la demande.
    """
    if month in [1, 2]:
        return 1.05
    if month in [6, 7, 8]:
        return 1.12
    if month in [12]:
        return 1.08
    return 1.00


def get_seasonal_donation_multiplier(month: int) -> float:
    """
    Effet saisonnier sur les dons.
    """
    if month in [6, 7, 8]:
        return 0.92
    if month in [12]:
        return 0.95
    return 1.00


def get_ramadan_like(date_obj: datetime) -> int:
    """
    Approximation simple pour simulation.
    """
    return int(date_obj.month in [3, 4])


def sigmoid(x: float) -> float:
    return 1 / (1 + np.exp(-x))


# =========================================================
# 6) GÉNÉRATION JOUR PAR JOUR
# =========================================================
# On génère d'abord la demande et les dons journaliers,
# puis on calcule les historiques réels sur 7 jours.
# =========================================================

rows = []

# On garde un mini historique par (hospital_id, blood_type)
history = {
    (hospital_id, blood_type): {
        "requested": [],
        "donated": [],
        "stock": []
    }
    for hospital_id in hospital_ids
    for blood_type in BLOOD_TYPES
}

for day_offset in range(N_DAYS):
    current_date = START_DATE + timedelta(days=day_offset)

    month = current_date.month
    is_weekend = int(current_date.weekday() >= 5)
    is_summer = int(month in [6, 7, 8])
    is_ramadan_like = get_ramadan_like(current_date)

    demand_season = get_seasonal_demand_multiplier(month)
    donation_season = get_seasonal_donation_multiplier(month)

    for hospital_id in hospital_ids:
        hp = hospital_profiles[hospital_id]

        for blood_type in BLOOD_TYPES:
            bp = blood_profiles[blood_type]

            key = (hospital_id, blood_type)
            hist = history[key]

            # -----------------------------
            # 6.1 DEMANDE DU JOUR
            # -----------------------------
            base_requested = 18

            requested_mean = (
                base_requested
                * hp["size_factor"]
                * hp["vulnerability_factor"]
                * bp["demand_factor"]
                * demand_season
                * (1.05 if is_weekend else 1.00)
                * (1.10 if is_ramadan_like else 1.00)
            )

            requested = np.random.poisson(max(requested_mean, 1))
            requested = max(0, int(requested))

            # -----------------------------
            # 6.2 DONS DU JOUR
            # -----------------------------
            base_donated = 16

            donated_mean = (
                base_donated
                * hp["size_factor"]
                * hp["collection_factor"]
                * bp["donation_factor"]
                * donation_season
                * (0.97 if is_weekend else 1.00)
                * (0.88 if is_ramadan_like else 1.00)
            )

            donated = np.random.poisson(max(donated_mean, 1))
            donated = max(0, int(donated))

            # -----------------------------
            # 6.3 HISTORIQUE RÉEL SUR 7 JOURS
            # -----------------------------
            prev_req = hist["requested"][-6:] if len(hist["requested"]) >= 1 else []
            prev_don = hist["donated"][-6:] if len(hist["donated"]) >= 1 else []

            req_7d = int(sum(prev_req) + requested)
            don_7d = int(sum(prev_don) + donated)

            # -----------------------------
            # 6.4 STOCK SIMULÉ
            # -----------------------------
            if len(hist["stock"]) == 0:
                initial_stock = int(
                    np.random.randint(20, 60)
                    * hp["stock_factor"]
                    * bp["donation_factor"]
                )
                previous_stock = max(0, initial_stock)
            else:
                previous_stock = hist["stock"][-1]

            # stock du jour après entrée/sortie
            current_stock = max(0, int(previous_stock + donated - requested))

            # -----------------------------
            # 6.5 VARIABLES DÉRIVÉES
            # -----------------------------
            gap_bags = requested - donated
            stock_coverage_days = round(current_stock / max(requested, 1), 2)

            shortage_pressure = (
                (gap_bags * 0.45)
                + ((req_7d - don_7d) * 0.08)
                + (8 if current_stock <= 5 else 0)
                + (4 if stock_coverage_days < 1.0 else 0)
                + (2 if is_ramadan_like else 0)
                + (1 if is_summer else 0)
            ) * bp["criticality"] * hp["vulnerability_factor"]

            # -----------------------------
            # 6.6 LABEL DE PÉNURIE
            # -----------------------------
            # On transforme la pression en probabilité,
            # puis on échantillonne le label.
            shortage_prob = sigmoid((shortage_pressure - 6) / 3.5)
            shortage_label = int(np.random.rand() < shortage_prob)

            # -----------------------------
            # 6.7 AJOUT DE LA LIGNE
            # -----------------------------
            rows.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "hospital_id": hospital_id,
                "blood_type": blood_type,
                "total_requested_bags": requested,
                "total_donated_bags": donated,
                "gap_bags": gap_bags,
                "current_stock_bags": current_stock,
                "stock_coverage_days": stock_coverage_days,
                "month": month,
                "is_weekend": is_weekend,
                "is_summer": is_summer,
                "is_ramadan_like": is_ramadan_like,
                "req_7d": req_7d,
                "don_7d": don_7d,
                "shortage_pressure": round(float(shortage_pressure), 4),
                "shortage_label": shortage_label,
            })

            # -----------------------------
            # 6.8 MISE À JOUR DE L'HISTORIQUE
            # -----------------------------
            hist["requested"].append(requested)
            hist["donated"].append(donated)
            hist["stock"].append(current_stock)


# =========================================================
# 7) DATAFRAME FINAL
# =========================================================

df = pd.DataFrame(rows)

# Tri utile
df = df.sort_values(by=["hospital_id", "blood_type", "date"]).reset_index(drop=True)

# Vérifications de base
df["shortage_label"] = df["shortage_label"].astype(int)
df["is_weekend"] = df["is_weekend"].astype(int)
df["is_summer"] = df["is_summer"].astype(int)
df["is_ramadan_like"] = df["is_ramadan_like"].astype(int)

# Sauvegarde
df.to_csv(OUTPUT_PATH, index=False)

# Contrôle
print("✅ Dataset généré avec succès.")
print(f"📁 Fichier : {OUTPUT_PATH}")
print(f"📏 Taille : {df.shape[0]} lignes, {df.shape[1]} colonnes")

print("\nAperçu :")
print(df.head())

print("\nRépartition shortage_label :")
print(df["shortage_label"].value_counts(normalize=True).round(4))

print("\nPar groupe sanguin :")
print(df["blood_type"].value_counts())

print("\nPar hôpital :")
print(df["hospital_id"].nunique())