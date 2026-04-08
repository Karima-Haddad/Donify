#!/bin/sh

set -e

echo "=== Vérification des datasets ==="

if [ ! -f data/shortage_model_dataset.csv ]; then
    echo "➡️ Génération dataset shortage..."
    python services/generate_shortage_dataset.py
else
    echo "✅ Dataset shortage déjà existant"
fi

if [ ! -f data/matching_training_dataset.csv ]; then
    echo "➡️ Génération dataset matching..."
    python services/generate_matching_dataset.py
else
    echo "✅ Dataset matching déjà existant"
fi

echo "=== Vérification des modèles ==="

if [ ! -f models/shortage_model.joblib ]; then
    echo "➡️ Entraînement modèle shortage..."
    python services/train_shortage_model.py
else
    echo "✅ Modèle shortage déjà existant"
fi

if [ ! -f models/xgboost.joblib ]; then
    echo "➡️ Entraînement modèle matching..."
    python services/train_matching_model.py
else
    echo "✅ Modèle matching déjà existant"
fi

echo "=== Lancement API ==="
exec uvicorn main:app --host 0.0.0.0 --port 8000