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

## 📂 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── repositories/    # Data access layer
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── validations/     # Input validation schemas
│   └── index.js         # App entry point
├── config/
│   ├── database.js      # DB connection config
│   ├── env.js           # Environment variables
│   └── logger.js        # Logging config
├── scripts/
│   └── seed-users.js    # Database seeding
├── data/
│   └── users.seed.json  # Sample user data
├── package.json
├── .env                 # Environment variables
└── README.md
```

## � Getting Started

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

## 📚 Documentation API

### Points de terminaison d'authentification

- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/forgot-password` - Demande de réinitialisation de mot de passe
- `POST /api/auth/reset-password` - Réinitialisation de mot de passe

### Points de terminaison des donneurs

- `GET /api/donors` - Obtenir tous les donneurs
- `POST /api/donors` - Créer un profil de donneur
- `GET /api/donors/:id` - Obtenir un donneur par ID
- `PUT /api/donors/:id` - Mettre à jour un donneur
- `DELETE /api/donors/:id` - Supprimer un donneur

### Points de terminaison des hôpitaux

- `GET /api/hospitals` - Obtenir tous les hôpitaux
- `POST /api/hospitals` - Créer un hôpital
- `GET /api/hospitals/:id` - Obtenir un hôpital par ID

### Intégration IA

- `POST /api/ai/predict-shortage` - Prédire une pénurie de sang
- `POST /api/ai/match-donors` - Obtenir les K meilleurs appariements de donneurs

## 🧪 Tests

Exécuter les tests :
```bash
npm test
```

Exécuter avec couverture :
```bash
npm run test:coverage
```



## 📦 Dépendances

### Production
- `express` - Framework web
- `pg` - Client PostgreSQL
- `dotenv` - Variables d'environnement
- `cors` - Partage de ressources cross-origin
- `zod` - Validation de schéma
- `bcryptjs` - Hachage de mot de passe
- `jsonwebtoken` - Authentification JWT
- `nodemailer` - Envoi d'emails
- `axios` - Client HTTP pour le service IA

### Développement
- `nodemon` - Redémarrage automatique du serveur
- `eslint` - Linting du code
- `prettier` - Formatage du code

## 🧠 Standards de codage

- **Async/Await** : Utilisez async/await pour les opérations asynchrones
- **Gestion d'erreurs** : Utilisez des blocs try/catch et un middleware d'erreur personnalisé
- **Validation** : Validez toutes les entrées en utilisant des schémas Zod
- **Sécurité** : Utilisez des requêtes paramétrées pour éviter les injections SQL
- **Journalisation** : Journalisez toutes les requêtes et erreurs de manière appropriée
- **Séparation des préoccupations** : Gardez la logique métier dans les services, l'accès aux données dans les repositories

## 🔮 Fonctionnalités planifiées

- [ ] Documentation API complète (Swagger/OpenAPI)
- [ ] Limitation de débit et middleware de sécurité
- [ ] Transactions de base de données pour les opérations complexes
- [ ] Support WebSocket pour les mises à jour en temps réel
- [ ] Contrôle d'accès basé sur les rôles avancé
- [ ] Versionnement d'API
- [ ] Couche de cache (Redis)
- [ ] Traitement des tâches en arrière-plan

## 🌱 Amorçage de la base de données

Pour amorcer la base de données avec des utilisateurs d'exemple :

```bash
node scripts/seed-users.js data/users.seed.json
```

Format JSON d'exemple :
```json
{
  "users": [
    {
      "email": "donor@example.com",
      "password_hash": "mot_de_passe_hashé",
      "role": "donor",
      "donor": {
        "blood_type": "A+"
      }
    }
  ]
}
```

## 🤝 Contribution

1. Suivez les standards de codage ci-dessus
2. Écrivez des tests pour les nouvelles fonctionnalités
3. Mettez à jour la documentation API
4. Utilisez des messages de commit significatifs

## 📄 Licence

[Spécifiez la licence si applicable]
