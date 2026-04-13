# 🛠 Backend Donify

API Node.js + Express pour la plateforme de gestion des dons de sang Donify.

## 📋 Vue d'ensemble

Le backend fournit des APIs RESTful pour la gestion des utilisateurs, l'appariement des donneurs, les opérations hospitalières et l'intégration avec les services IA. Il utilise PostgreSQL (via Supabase) pour la persistance des données et suit une architecture modulaire avec contrôleurs, services et modèles.

## 🏗 Architecture

- **Framework** : Express.js
- **Base de données** : PostgreSQL (Supabase Cloud)
- **Authentification** : JWT avec bcrypt
- **Validation** : Schémas Zod
- **Journalisation** : Pino avec journalisation HTTP
- **Email** : Nodemailer pour les notifications
- **Structure** : Pattern MVC avec couche de services

## 📂 Structure du projet

```
backend/
├── .dockerignore
├── .env                   # Variables d'environnement locales
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── test.js                # Script utilitaire / debug
├── config/
│   ├── database.js        # Configuration de la connexion PostgreSQL
│   ├── env.js             # Chargement des variables d'environnement
│   └── logger.js          # Configuration du logging
├── controllers/           # Contrôleurs métier
├── middleware/            # Middlewares Express
├── repositories/          # Accès aux données
├── routes/                # Définition des routes API
└── src/
    ├── index.js           # Point d'entrée de l'application
    ├── services/          # Intégration IA et logique métier
    ├── validators/        # Schémas de validation
    └── models/            # Modèles de données (si présents)
```

## 🚀 Getting Started

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Base de données PostgreSQL (Supabase recommandé)

### Installation

1. Naviguez vers le répertoire backend :
   ```bash
   cd backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

### Variables d'environnement

Créez un fichier `.env` à la racine de `backend/` contenant au minimum :

```env
PORT=4000
JWT_SECRET=donify_secret_key_2026
DATABASE_URL=postgresql://postgres.bvtzgwqjwttuwhceyqba:Donify-2026@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
AI_SERVICE_URL=http://localhost:8000
INTERNAL_API_KEY=donify_ML_Key_2026
EMAIL_USER=donify.app@gmail.com
EMAIL_PASS=yzwp vvof cxxn hwgz
```

### Lancement du serveur

Pour le développement :
```bash
npm run dev
```

Pour la production :
```bash
npm start
```

Le serveur tournera sur : `http://localhost:4000`

Point de terminaison de vérification de santé : `GET /health`

## 🐳 Dockerisation

1. Construction de l'image

Depuis le dossier `backend/` :
```bash
docker build -t donify-backend .
```

2. Lancement du conteneur

```bash
docker run -d -p 4000:4000 --name donify-backend-container --env-file .env donify-backend
```

3. Vérification

```bash
docker ps
```

Exemple de sortie :
```bash
CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                                         NAMES
7dd5b81ca9be   donify-backend   "docker-entrypoint.s…"   16 seconds ago   Up 16 seconds   0.0.0.0:4000->4000/tcp, [::]:4000->4000/tcp   donify-backend-container
```

4. Logs

```bash
docker logs donify-backend-container
```

5. Arrêt du conteneur

```bash
docker stop donify-backend-container
```


6. Démarrage du conteneur

```bash
docker start donify-backend-container
```

## 📚 Documentation API

### Santé et profil

- `GET /health` - Vérification du service
- `GET /api/profile` - Profil sécurisé (JWT requis)

### Authentification

- `POST /api/auth/register/donor` - Inscription d'un donneur
- `POST /api/auth/register/hospital` - Inscription d'un hôpital
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/forgot-password` - Demande de réinitialisation de mot de passe
- `POST /api/auth/reset-password` - Réinitialisation de mot de passe
- `GET /api/auth/users` - Liste des utilisateurs (usage interne/test)
- `GET /api/auth/donors` - Liste des donneurs (usage interne/test)
- `GET /api/auth/hospitals` - Liste des hôpitaux (usage interne/test)

### Matching IA

- `GET /api/matching/ml-health` - Vérification du service IA
- `POST /api/matching/topk` - Recherche des meilleurs donneurs compatibles
- `POST /api/matching/validate-donation` - Valider une donation
- `GET /api/matching/validated-donations/:requestId` - Obtenir les donations validées pour une demande

### Prédiction de pénurie

- `POST /api/shortage/predict` - Prédiction de pénurie de sang

### Autres domaines

- Routes pour `blood-requests`, `donor`, `hospital`, `notifications`, `donor-responses` et `donations`


## 📦 Dépendances

### Production
- `express` - Framework web
- `pg` - Client PostgreSQL
- `dotenv` - Variables d'environnement
- `cors` - Partage de ressources cross-origin
- `zod` - Validation de schéma
- `bcrypt` - Hachage de mot de passe
- `bcryptjs` - Hachage de mot de passe
- `jsonwebtoken` - Authentification JWT
- `nodemailer` - Envoi d'emails
- `axios` - Client HTTP pour le service IA
- `pino` - Logger performant
- `pino-http` - Middleware HTTP pour Pino
- `pino-pretty` - Affichage lisible des logs
- `uuid` - Génération d'identifiants uniques

### Développement
- `nodemon` - Redémarrage automatique du serveur

