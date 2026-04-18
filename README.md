# 🩸 Donify

Donify est une plateforme de gestion des dons de sang qui connecte les donneurs, les hôpitaux et les services de prédiction alimentés par l'IA pour réduire les pénuries de sang et optimiser la réponse d'urgence.

## 📋 Vue d'ensemble

Donify révolutionne la gestion des dons de sang en combinant une interface utilisateur moderne, des APIs robustes et des algorithmes d'intelligence artificielle. La plateforme facilite l'appariement en temps réel des donneurs avec les besoins hospitaliers, prédit les pénuries potentielles et optimise la logistique des dons de sang.

## 🚀 Vision

Construire un écosystème intelligent, évolutif et axé sur les données qui améliore la coordination des dons de sang en utilisant l'appariement en temps réel et les prédictions IA.

## 🏗 Architecture système

Donify suit une architecture modulaire prête pour les microservices :

```
Frontend (React + Vite + TypeScript)
    ⬇
Backend API (Node.js + Express)
    ⬇
Base de données (PostgreSQL - Supabase Cloud)
    ⬇
Service IA (Python - FastAPI)
```

### Composants principaux

- **Frontend** : Interface utilisateur réactive pour donneurs et hôpitaux
- **Backend** : APIs RESTful pour la logique métier et l'authentification
- **Base de données** : Stockage persistant avec Supabase PostgreSQL
- **IA** : Modèles de prédiction et d'appariement des donneurs

## 📂 Structure du projet

```
project-root/
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── README.md
├── docs/             # Documentation et architecture
├── backend/          # Serveur API Node.js
│   ├── src/          # Code source backend
│   ├── config/       # Configuration backend
│   ├── routes/       # Routes API backend
│   └── README.md     # Documentation backend
├── frontend/         # Application React
│   ├── src/          # Code source frontend
│   ├── public/       # Ressources statiques frontend
│   └── README.md     # Documentation frontend
├── ai/               # Service de prédiction IA
│   ├── models/       # Modèles entraînés
│   ├── services/     # Scripts d'IA
│   └── README.md     # Documentation IA
└── scripts/          # Outils et utilitaires de projet
```

## ⚙️ Technologies

### Frontend
- **React** - Bibliothèque UI moderne
- **Vite** - Outil de build rapide
- **TypeScript** - Sécurité des types
- **React Router DOM** - Navigation
- **Axios** - Client HTTP
- **Tailwind CSS** - Styles utilitaires

### Backend
- **Node.js + Express** - Framework API
- **PostgreSQL** - Base de données
- **Supabase** - Plateforme cloud
- **JWT** - Authentification
- **Zod** - Validation
- **Pino** - Journalisation

### Intelligence Artificielle
- **Python + FastAPI** - Service IA
- **Scikit-learn** - Apprentissage automatique
- **XGBoost** - Modèles avancés
- **Pandas** - Analyse de données
- **Joblib** - Sérialisation de modèles

### Outils de développement
- **Git + GitHub** - Contrôle de version
- **ESLint + Prettier** - Qualité du code
- **Docker Compose** - Orchestration de services

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v16+)
- Python (3.8+)
- PostgreSQL (via Supabase)
- Git

### 1️⃣ Cloner le dépôt

```bash
git clone <url-du-repo>
cd project-root
```

**Première exécution uniquement**

Avant de démarrer le serveur FastAPI pour la première fois, lancez le script de préparation :
```bash
cd ai
python services/entrypoint.py
```
Ce script crée les datasets et entraîne les modèles manquants si nécessaire.

### 2️⃣ Configuration du backend

```bash
cd backend
npm install
# Créer .env avec les variables appropriées
npm run dev
```

Le serveur backend tournera sur : `http://localhost:4000`

### 3️⃣ Configuration du frontend

```bash
cd ../frontend
npm install
npm run dev
```

Le frontend tournera sur : `http://localhost:5173`

### 4️⃣ Configuration de l'IA

```bash
cd ../ai
python -m venv venv
venv\Scripts\activate  # Sur Windows
pip install -r requirements.txt
# Créez un fichier .env avec INTERNAL_API_KEY
python -m uvicorn main:app --reload
```

Le service IA tournera sur : `http://localhost:8000`

## 🐳 Docker Compose

Pour lancer toute l'application avec Docker Compose :

```bash
docker compose up --build
```

Cette commande :
- Construit les images pour le frontend, backend et IA
- Lance tous les services avec les bonnes configurations réseau
- Monte les volumes pour le développement

### Services démarrés

- **Frontend** : `http://localhost:5173` (Nginx)
- **Backend** : `http://localhost:4000` (Node.js)
- **IA** : `http://localhost:8000` (Python FastAPI)

### Exemple de logs au démarrage

```
[+] up 6/6
 ✔ Image project-root-ai       Built
 ✔ Image project-root-backend  Built
 ✔ Image project-root-frontend Built
 ✔ Container donify-ai         Recreated
 ✔ Container donify-backend    Recreated
 ✔ Container donify-frontend   Recreated
Attaching to donify-ai, donify-backend, donify-frontend
donify-ai  | === Vérification des datasets ===
donify-ai  | ✅ Dataset shortage déjà existant
donify-ai  | ✅ Dataset matching déjà existant
donify-ai  | === Vérification des modèles ===
donify-ai  | ✅ Modèle shortage déjà existant
donify-ai  | ✅ Modèle matching déjà existant
donify-ai  | === Lancement API ===
donify-ai  | INFO:     Uvicorn running on http://0.0.0.0:8000
donify-backend  | 🚀 Server running on port 4000
donify-backend  | 🤖 AI Service URL: http://ai:8000
donify-frontend  | nginx/1.29.7
donify-frontend  | start worker processes
```

### Arrêt des services

```bash
docker compose down
```

## 🌍 Workflow de développement

- `main` → code prêt pour la production
- `feature/*` → développement individuel

## 📊 État actuel du projet

- ✅ Backend Node.js + Express en cours d'intégration
- ✅ Frontend React + Vite initialisé
- ✅ Service IA FastAPI disponible dans `ai/`
- ✅ Authentification JWT implémentée
- ✅ Routes principales pour donneurs, hôpitaux et matching
- ✅ Docker Compose présent pour l'orchestration des services

## 📞 Support

Pour obtenir de l'aide ou signaler un problème :

- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation dans `/docs`

---

**Donify** - Sauver des vies, une goutte à la fois. 🩸


