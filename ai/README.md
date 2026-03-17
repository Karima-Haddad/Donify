# Module IA pour Donify

## Vue d'ensemble

Le répertoire `ai/` contient les composants d'apprentissage automatique du projet Donify, une plateforme de mise en correspondance des dons de sang. Ce module fournit des modèles prédictifs pour la prévision des pénuries de sang et des algorithmes de mise en correspondance des donneurs, exposés via un service FastAPI.

## Fonctionnalités

- **Prédiction des pénuries de sang** : Utilise un modèle Random Forest pour prédire les pénuries de sang basées sur des données historiques et des caractéristiques comme les poches demandées/données, les facteurs saisonniers et les types sanguins.

- **Mise en correspondance Top-K des donneurs** : Classe et sélectionne les K meilleurs donneurs compatibles pour les demandes de sang en utilisant des modèles de classement XGBoost.

- **Scripts de génération de données et d'entraînement** : Outils pour générer des ensembles de données synthétiques et entraîner des modèles.

- **Service API** : API REST basée sur FastAPI pour des prédictions en temps réel.

- **Cahiers d'analyse** : Cahiers Jupyter pour l'évaluation des modèles et les insights.

## Installation

1. **Clonez le dépôt** et naviguez vers le répertoire `ai/` :
   ```bash
   cd ai/
   ```

2. **Créez un environnement virtuel** (recommandé) :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur Windows : venv\Scripts\activate
   ```

3. **Installez les dépendances** :
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurez les variables d'environnement** :
   Créez un fichier `.env` dans le répertoire `ai/` avec :
   ```
   INTERNAL_API_KEY=donify_ML_Key_2026
   ```

## Utilisation

### Lancement du service API

Démarrez le serveur FastAPI :
```bash
python -m uvicorn main:app --reload
```

L'API sera disponible sur `http://localhost:8000`.

### Entraînement des modèles

Exécutez le script d'entraînement de prédiction des pénuries :
```bash
python train_shortage.py    
```
Cela entraînera un modèle Random Forest et le sauvegardera dans `models/shortage_model.pkl`.

Exécutez le script d'entraînement de modèle de matching:
```bash
python services/train_matchig_model.py
```
Cela entraînera les 3 modèles testés (Logistic Regression, Random Forest, XGBoost) et les sauvegardera dans `models`.


### Génération d'ensembles de données

Utilisez le script de génération d'ensembles de données pour le modèle de punérie :
```bash
python generate_big_dataset.py
```

Utilisez le script de génération d'ensembles de données pour le modèle de matching :
```bash
python generate_big_dataset.py
```


### Points de terminaison API

- **Vérification de santé** : `GET /health`
  - Nécessite l'en-tête `x-api-key` avec la clé API interne.
  - Retourne le statut du service.

- **Prédiction des pénuries** : `POST /predict`
  - Corps : JSON avec des caractéristiques comme `total_requested_bags`, `blood_type`, etc.
  - Retourne la pénurie prédite et la probabilité de risque.

- **Mise en correspondance Top-K** : `POST /predict-topk`
  - Nécessite l'en-tête `x-api-key`.
  - Corps : Liste des candidats donneurs et valeur `k`.
  - Retourne les K meilleurs donneurs correspondants.

### Exécution des cahiers

Ouvrez les cahiers Jupyter pour l'analyse des métriques :
```bash
jupyter notebook notebooks/matching_model_analysis.ipynb
```

## Structure du projet

```
ai/
├── main.py                 # Application FastAPI
├── train_shortage.py       # Script d'entraînement du modèle de pénurie
├── generate_big_dataset.py # Script de génération d'ensembles de données
├── requirements.txt        # Dépendances Python
├── data/
│   └── candidates.csv      # Données d'exemple des candidats
├── models/
│   ├── xgboost.joblib      # Modèle XGBoost entraîné
│   └── experiments/        # Modèles expérimentaux
├── notebooks/
│   └── matching_model_analysis.ipynb  # Cahier d'analyse
├── reports/
│   └── metrics/
│       └── metrics_results.csv  # Métriques des modèles
├── services/
│   ├── topk_matching.py    # Logique de mise en correspondance Top-K
│   ├── create_excel_report.py  # Génération de rapports
│   └── train_matchig_model.py  # Utilitaires d'entraînement des modèles
├── src/                    # Code source
└── tests/                  # Tests unitaires
```

## Dépendances

- pandas
- numpy
- scikit-learn
- joblib
- flask
- xgboost
- fastapi
- uvicorn
- pydantic

