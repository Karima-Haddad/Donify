'''
Ce script entraîne un modèle de classification pour prédire les pénuries de sang à partir d'un dataset réaliste.
Il utilise un Random Forest Classifier et prend en compte des features telles que le nombre de sacs demandés, donnés, le mois, les jours de la semaine, etc.
Ce modèle a été testé et  évalué avant le modèle final XGboost utilisé dans l'API.
'''

import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import roc_curve
import matplotlib.pyplot as plt


# =========================
# 1️⃣ Charger dataset
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(BASE_DIR, "data", "big_realistic_dataset.csv")

df = pd.read_csv(data_path)

# =========================
# 2️⃣ Encodage blood_type
# =========================
le = LabelEncoder()
df["blood_type_encoded"] = le.fit_transform(df["blood_type"])

# =========================
# 3️⃣ Sélection des features
# =========================
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

X = df[features]
y = df["shortage_label"]

# =========================
# 4️⃣ Split train/test
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y   # important pour dataset déséquilibré
)

# =========================
# 5️⃣ Modèle
# =========================
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_split=5,
    random_state=42,
    class_weight={0:1, 1:2}   # on donne plus d'importance à la pénurie
)

model.fit(X_train, y_train)

# =========================
# 6️⃣ Évaluation
# =========================
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\n📊 Classification Report:\n")
print(classification_report(y_test, y_pred))

print("AUC:", roc_auc_score(y_test, y_prob))


fpr, tpr, _ = roc_curve(y_test, y_prob)

plt.figure()
plt.plot(fpr, tpr)
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve")
plt.savefig("roc_curve.png")  # sauvegarde image
plt.show()


# =========================
# 7️⃣ Sauvegarde modèle
# =========================
model_dir = os.path.join(BASE_DIR, "model")
os.makedirs(model_dir, exist_ok=True)

model_path = os.path.join(model_dir, "shortage_model.pkl")
encoder_path = os.path.join(model_dir, "blood_type_encoder.pkl")

joblib.dump(model, model_path)
joblib.dump(le, encoder_path)

print("\n✅ Modèle et encoder sauvegardés avec succès dans ai/model/")



####################################################

print(df["shortage_label"].value_counts())

####################################################