"""
Donify - Training Script
-----------------------
Ce script entraîne 3 modèles de Machine Learning sur le dataset:
- Logistic Regression (baseline)
- Random Forest (modèle principal)
- XGBoost (boosting avancé)

Il compare les performances via :
Accuracy, Precision, Recall, F1-score, ROC-AUC

Sorties :
- Affichage d'un tableau comparatif des métriques
- Sauvegarde du préprocesseur et des modèles entraînés
"""

import os
import numpy as np
import pandas as pd

from joblib import dump

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier


# =========================
# 1) Paramètres généraux
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "matching_training_dataset.csv")
TARGET_COL = "accepted_label"
RANDOM_SEED = 42
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "models")


# =========================
# 2) Fonctions utilitaires
# =========================

def evaluate_classification_model(model, X_test, y_test):
    """
    Calcule toutes les métriques demandées.
    Retourne un dictionnaire de résultats.
    """

    # Prédictions 
    y_pred = model.predict(X_test)

    # Probabilités 
    y_proba = model.predict_proba(X_test)[:, 1]

    results = {
        "Accuracy": accuracy_score(y_test, y_pred),
        "Precision": precision_score(y_test, y_pred, zero_division=0),
        "Recall": recall_score(y_test, y_pred, zero_division=0),
        "F1-score": f1_score(y_test, y_pred, zero_division=0),
        "ROC-AUC": roc_auc_score(y_test, y_proba)
    }

    return results


def print_metrics_table(metrics_dict):
    """
    Affiche un tableau propre des résultats.
    """
    results_df = pd.DataFrame(metrics_dict).T
    # Arrondir pour un affichage lisible
    results_df = results_df.round(4)
    print("\n===== Résultats comparatifs =====")
    print(results_df)
    return results_df


# =========================
# 3) Chargement des données
# =========================

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(
        f"❌ Fichier introuvable: {DATA_PATH}\n"
        "➡️ Vérifie le chemin du fichier CSV."
    )

df = pd.read_csv(DATA_PATH)

print("✅ Dataset chargé.")
print("Shape:", df.shape)
print("\n📌 Aperçu:")
print(df.head())

# Vérifier distribution de la cible
print("\n📊 Distribution de accepted_label:")
print(df[TARGET_COL].value_counts())
print("\n📊 Proportions:")
print(df[TARGET_COL].value_counts(normalize=True).round(4))


# =========================
# 4) Séparation X / y
# =========================

# X = toutes les colonnes sauf la cible
X = df.drop(columns=[TARGET_COL])
# y = cible
y = df[TARGET_COL].astype(int)

# Colonnes catégorielles et numériques
categorical_cols = ["gender", "donor_blood_type"]
numeric_cols = [col for col in X.columns if col not in categorical_cols]

print("\n🧾 Colonnes catégorielles:", categorical_cols)
print("🧾 Colonnes numériques:", numeric_cols)


# =========================
# 5) Train/Test Split
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=RANDOM_SEED,
    stratify=y
)

print("\n✅ Split effectué:")
print("Train:", X_train.shape, "Test:", X_test.shape)


# =========================
# 6) Préprocessing (OneHot + passthrough)
# =========================

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
        ("num", "passthrough", numeric_cols)
    ]
)


# =========================
# 7) Définition des modèles
# =========================

# 1) Logistic Regression (baseline)
log_reg = LogisticRegression(
    max_iter=2000,
    random_state=RANDOM_SEED,
    class_weight="balanced"  #  si classe 1 minoritaire
)

# 2) Random Forest (modèle principal)
rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    random_state=RANDOM_SEED,
    class_weight="balanced_subsample",
    n_jobs=-1
)

# 3) XGBoost (boosting)
# scale_pos_weight aide quand la classe 1 est minoritaire
pos_ratio = (y_train == 0).sum() / max((y_train == 1).sum(), 1)

xgb = XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=RANDOM_SEED,
    eval_metric="logloss",
    scale_pos_weight=pos_ratio
)

models = {
    "Logistic Regression (baseline)": log_reg,
    "Random Forest (principal)": rf,
    "XGBoost": xgb
}


# =========================
# 8) Entraînement + Évaluation
# =========================

all_metrics = {}
trained_pipelines = {}

for name, model in models.items():
    print(f"\n🚀 Entraînement du modèle: {name}")

    # Pipeline = preprocessing + modèle
    pipeline = Pipeline(steps=[
        ("preprocess", preprocessor),
        ("model", model)
    ])

    # Entraîner
    pipeline.fit(X_train, y_train)

    # Évaluer
    metrics = evaluate_classification_model(pipeline, X_test, y_test)
    all_metrics[name] = metrics

    trained_pipelines[name] = pipeline

    print("✅ Terminé. Metrics:", {k: round(v, 4) for k, v in metrics.items()})


# Afficher tableau final
results_df = print_metrics_table(all_metrics)


# =========================
# 9) Sauvegarde des modèles
# =========================

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Sauvegarder chaque pipeline (préprocesseur + modèle)
for name, pipeline in trained_pipelines.items():
    safe_name = name.lower().replace(" ", "_").replace("(", "").replace(")",").").replace(")", "")
    model_path = os.path.join(OUTPUT_DIR, f"{safe_name}.joblib")
    dump(pipeline, model_path)
    print(f"💾 Modèle sauvegardé: {model_path}")

# Sauvegarder le tableau des résultats
results_path = os.path.join(OUTPUT_DIR, "metrics_results.csv")
results_df.to_csv(results_path)
print(f"\n📄 Résultats sauvegardés dans: {results_path}")

print("\n✅ Fin du script.")