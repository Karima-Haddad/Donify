'''
Ce script entraîne un modèle de classification pour prédire les pénuries de sang à partir d'un dataset réaliste.
Il utilise un XGBoost Classifier et prend en compte des features telles que le nombre de sacs demandés, donnés, le mois, les jours de la semaine, etc.
'''
import os
import json
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)
from xgboost import XGBClassifier


# =========================================================
# 1) CHEMINS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(BASE_DIR, "..", "data", "shortage_model_dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODELS_DIR, "shortage_model.joblib")
BLOOD_ENCODER_PATH = os.path.join(MODELS_DIR, "blood_type_encoder.joblib")
FEATURES_PATH = os.path.join(BASE_DIR,".." ,"shortage_model_features.json")


# =========================================================
# 2) CHARGEMENT DU DATASET
# =========================================================

df = pd.read_csv(DATASET_PATH)

print("✅ Dataset chargé.")
print("Taille :", df.shape)
print(df.head())


# =========================================================
# 3) VALIDATION DES COLONNES
# =========================================================

required_columns = [
    "hospital_id",
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
    "don_7d",
    "shortage_label"
]

missing_columns = [col for col in required_columns if col not in df.columns]
if missing_columns:
    raise ValueError(f"Colonnes manquantes dans le dataset : {missing_columns}")


# =========================================================
# 4) NETTOYAGE
# =========================================================

df = df.dropna().copy()

numeric_columns = [
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
    "don_7d",
    "shortage_label"
]

for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")

df = df.dropna().copy()

df["shortage_label"] = df["shortage_label"].astype(int)
df["is_weekend"] = df["is_weekend"].astype(int)
df["is_summer"] = df["is_summer"].astype(int)
df["is_ramadan_like"] = df["is_ramadan_like"].astype(int)
df["month"] = df["month"].astype(int)

print("\n✅ Données nettoyées.")
print("Nouvelle taille :", df.shape)


# =========================================================
# 5) ENCODAGE DE blood_type SEULEMENT
# =========================================================

blood_encoder = LabelEncoder()
df["blood_type_encoded"] = blood_encoder.fit_transform(df["blood_type"])

print("\n✅ Encodage blood_type terminé.")
print("Classes blood_type :", list(blood_encoder.classes_))


# =========================================================
# 6) FEATURES / TARGET
# =========================================================
# IMPORTANT :
# On NE met PAS hospital_id dans les features.
# hospital_id sert uniquement côté backend pour récupérer les données.
# =========================================================

features = [
    "blood_type_encoded",
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

target = "shortage_label"

X = df[features]
y = df[target]

print("\n✅ Features sélectionnées :")
print(features)


# =========================================================
# 7) SPLIT TRAIN / TEST
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\n✅ Split terminé.")
print("Train :", X_train.shape, y_train.shape)
print("Test  :", X_test.shape, y_test.shape)


# =========================================================
# 8) ENTRAÎNEMENT DU MODÈLE
# =========================================================

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.08,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="binary:logistic",
    eval_metric="logloss",
    random_state=42
)

model.fit(X_train, y_train)

print("\n✅ Entraînement terminé.")


# =========================================================
# 9) ÉVALUATION
# =========================================================

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)
roc_auc = roc_auc_score(y_test, y_proba)

print("\n===== ÉVALUATION DU MODÈLE =====")
print(f"Accuracy  : {accuracy:.4f}")
print(f"Precision : {precision:.4f}")
print(f"Recall    : {recall:.4f}")
print(f"F1-score  : {f1:.4f}")
print(f"ROC-AUC   : {roc_auc:.4f}")

print("\nClassification report :")
print(classification_report(y_test, y_pred, zero_division=0))

print("\nConfusion matrix :")
print(confusion_matrix(y_test, y_pred))


# =========================================================
# 10) IMPORTANCE DES FEATURES
# =========================================================

feature_importances = pd.DataFrame({
    "feature": features,
    "importance": model.feature_importances_
}).sort_values(by="importance", ascending=False)

print("\n===== IMPORTANCE DES FEATURES =====")
print(feature_importances)


# =========================================================
# 11) SAUVEGARDE
# =========================================================

joblib.dump(model, MODEL_PATH)
joblib.dump(blood_encoder, BLOOD_ENCODER_PATH)

with open(FEATURES_PATH, "w", encoding="utf-8") as f:
    json.dump(features, f, ensure_ascii=False, indent=2)

print("\n✅ Modèle sauvegardé :", MODEL_PATH)
print("✅ Encodeur blood_type sauvegardé :", BLOOD_ENCODER_PATH)
print("✅ Liste des features sauvegardée :", FEATURES_PATH)