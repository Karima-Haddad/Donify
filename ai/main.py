from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd

# =========================
# Setup Flask
# =========================
app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model", "shortage_model.pkl")
encoder_path = os.path.join(BASE_DIR, "model", "blood_type_encoder.pkl")

# Charger le modèle et l'encodeur
model = joblib.load(model_path)
encoder = joblib.load(encoder_path)

# =========================
# Endpoint prediction
# =========================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data_dict = request.json
        # Vérification basique
        if not data_dict:
            return jsonify({"error": "Aucune donnée reçue"}), 400

        # Conversion en DataFrame
        df = pd.DataFrame([data_dict])

        # Encoder blood_type
        if "blood_type" not in df.columns:
            return jsonify({"error": "blood_type manquant"}), 400

        df["blood_type_encoded"] = encoder.transform([df["blood_type"][0]])

        # Sélection des features pour le modèle
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

        # Vérification des colonnes manquantes
        missing_cols = [f for f in features if f not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Colonnes manquantes: {missing_cols}"}), 400

        # Prédiction
        prediction = model.predict(df[features])[0]
        probability = model.predict_proba(df[features])[0][1]

        return jsonify({
            "shortage_predicted": int(prediction),
            "risk_probability": float(probability)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# Lancement du serveur Flask
# =========================
if __name__ == "__main__":
    # Activation debug pour développement
    app.run(host='0.0.0.0', port=8000, debug=True)