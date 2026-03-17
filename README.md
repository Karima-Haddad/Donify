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
├── backend/          # Serveur API Node.js
│   ├── src/          # Code source
│   ├── config/       # Configuration
│   ├── scripts/      # Scripts utilitaires
│   └── README.md     # Documentation backend
├── frontend/         # Application React
│   ├── src/          # Code source
│   ├── public/       # Ressources statiques
│   └── README.md     # Documentation frontend
├── ai/               # Service de prédiction IA
│   ├── models/       # Modèles entraînés
│   ├── services/     # Scripts d'IA
│   └── README.md     # Documentation IA
├── docs/             # Documentation et architecture
└── README.md         # Ce fichier
```

## ⚙️ Technologies

### Frontend
- **React 18** - Bibliothèque UI moderne
- **Vite** - Outil de build rapide
- **TypeScript** - Sécurité des types
- **React Router** - Navigation
- **Axios** - Client HTTP

### Backend
- **Node.js + Express** - Framework API
- **PostgreSQL** - Base de données
- **Supabase** - Plateforme cloud
- **JWT** - Authentification
- **Zod** - Validation

### Intelligence Artificielle
- **Python + FastAPI** - Service IA
- **Scikit-learn** - Apprentissage automatique
- **XGBoost** - Modèles avancés
- **Pandas** - Analyse de données

### Outils de développement
- **Git + GitHub** - Contrôle de version
- **ESLint + Prettier** - Qualité du code
- **Docker** - Conteneurisation (planifié)

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
# Créer .env avec INTERNAL_API_KEY
python -m uvicorn main:app --reload
```

Le service IA tournera sur : `http://localhost:8000`

## 🌍 Workflow de développement

- `main` → Code prêt pour la production
- `dev` → Branche d'intégration
- `feature/*` → Développement individuel

## 📊 État actuel du projet

- ✅ Backend connecté à Supabase
- ✅ Schéma de base de données implémenté
- ✅ Frontend initialisé avec TypeScript
- ✅ Module IA en développement
- ✅ Authentification JWT
- ✅ APIs de base pour donneurs et hôpitaux

## 🔮 Fonctionnalités planifiées

### Phase 1 (Courant)
- [x] Architecture de base
- [x] Authentification utilisateur
- [x] Gestion des profils donneurs/hôpitaux
- [ ] Interface d'appariement IA

### Phase 2 (Prochaine)
- [ ] Prédictions de pénuries en temps réel
- [ ] Notifications push
- [ ] Application mobile
- [ ] Intégration avec les systèmes hospitaliers

### Phase 3 (Futur)
- [ ] Analytics avancés
- [ ] IA prédictive pour les campagnes
- [ ] Intégration blockchain pour la traçabilité
- [ ] API publique pour les partenaires

## 🤝 Contribution

Nous accueillons les contributions ! Voici comment participer :

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de contribution

- Suivez les guides de style (ESLint, Prettier)
- Écrivez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation
- Utilisez des messages de commit descriptifs

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE). Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour obtenir de l'aide ou signaler un problème :

- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation dans `/docs`

---

**Donify** - Sauver des vies, une goutte à la fois. 🩸



## 🌍 Development Workflow

- `main` → production-ready code
- `dev` → integration branch
- `feature/*` → individual development

---

## 📌 Current Status

- Backend connected to Supabase
- Database schema implemented
- Frontend initialized with TypeScript
- AI module under development

---

## 👥 Team Guidelines

- Follow ESLint rules
- Use conventional commits
- Do not push `.env` files
- Always create feature branches

---

## 📈 Future Roadmap

- Authentication system
- Smart donor matching algorithm
- AI shortage prediction
- Notification system
- Production deployment

---

