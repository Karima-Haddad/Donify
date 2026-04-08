# 🎨 Frontend Donify

Application React + Vite + TypeScript pour la plateforme de gestion des dons de sang Donify.

## 📋 Vue d'ensemble

Le frontend fournit une interface utilisateur moderne et réactive pour la gestion des dons de sang. Il permet aux donneurs, hôpitaux et administrateurs d'interagir avec la plateforme via une interface web intuitive. L'application communique avec le backend via des APIs REST et intègre des visualisations des prédictions IA.

## 🏗 Architecture

- **Framework** : React 18 avec hooks
- **Outil de build** : Vite pour un développement rapide
- **Langage** : TypeScript pour la sécurité des types
- **Routing** : React Router pour la navigation
- **HTTP Client** : Axios pour les appels API
- **Styling** : CSS modules et composants stylisés
- **État** : Context API et hooks personnalisés

## 📂 Structure du projet

```
frontend/
├── public/
│   └── assets/          # Images et ressources statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── common/      # Composants génériques (boutons, modales)
│   │   ├── forms/       # Composants de formulaires
│   │   └── layout/      # Composants de mise en page
│   ├── pages/           # Pages principales de l'application
│   │   ├── auth/        # Pages d'authentification
│   │   ├── dashboard/   # Tableaux de bord
│   │   └── profile/     # Gestion des profils
│   ├── services/        # Services API et utilitaires
│   │   ├── api/         # Clients API
│   │   └── auth/        # Services d'authentification
│   ├── hooks/           # Hooks personnalisés React
│   ├── types/           # Interfaces et types TypeScript
│   ├── utils/           # Fonctions utilitaires
│   ├── contexts/        # Contextes React pour l'état global
│   ├── App.tsx          # Composant racine
│   └── main.tsx         # Point d'entrée
├── .env                 # Variables d'environnement
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Démarrage

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation

1. Naviguez vers le répertoire frontend :
   ```bash
   cd frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```



### Lancement du serveur de développement

```bash
npm run dev
```

L'application tournera sur : `http://localhost:5173`

### Build pour la production

```bash
npm run build
```

Les fichiers de build seront générés dans le dossier `dist/`.

## � Dockerisation

### Construction de l'image

Depuis le dossier `frontend/` :
```bash
docker build -t donify-frontend .
```

### Lancement du conteneur

```bash
docker run -d -p 5173:80 --name donify-frontend-container donify-frontend
```

### Vérification

```bash
docker ps
```

Exemple de sortie :
```bash
CONTAINER ID   IMAGE             COMMAND                  CREATED             STATUS             PORTS                                         NAMES
b110b95999a4   donify-frontend   "/docker-entrypoint.…"   4 seconds ago       Up 3 seconds       0.0.0.0:5173->80/tcp, [::]:5173->80/tcp       donify-frontend-container
```

### Logs

```bash
docker logs donify-frontend-container
```

### Arrêt du conteneur

```bash
docker stop donify-frontend-container
```

### Démarrage du conteneur

```bash
docker start donify-frontend-container
```

## �📚 Fonctionnalités principales

### Authentification
- Inscription et connexion des utilisateurs
- Gestion des sessions avec JWT
- Récupération de mot de passe

### Tableaux de bord
- **Donneurs** : Historique des dons
- **Hôpitaux** : Gestion des stocks, demandes d'urgence, statistiques, punéries


### Gestion des dons
- Recherche de donneurs compatibles
- Planification de rendez-vous
- Suivi des dons et tests

### Intégration IA
- Visualisation des prédictions de pénuries
- Recommandations d'appariement
- Analyses et rapports

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
- `react` - Bibliothèque UI
- `react-dom` - Rendu React
- `react-router-dom` - Routing
- `axios` - Client HTTP
- `uuid` - Génération d'identifiants uniques

### Développement
- `@types/react` - Types TypeScript pour React
- `@types/react-dom` - Types pour React DOM
- `@vitejs/plugin-react` - Plugin Vite pour React
- `eslint` - Linting
- `prettier` - Formatage du code
- `@typescript-eslint/eslint-plugin` - Règles ESLint pour TypeScript

## 🧠 Standards de codage

- **Composants** : Utilisez des composants fonctionnels avec hooks
- **Types** : Définissez des interfaces TypeScript pour toutes les props
- **État** : Préférez les hooks useState et useEffect locaux
- **API** : Centralisez les appels API dans des services dédiés
- **Styling** : Utilisez des classes CSS modulaires
- **Performance** : Utilisez React.memo et useMemo pour l'optimisation

## 🔮 Fonctionnalités planifiées

- [ ] Interface d'authentification complète
- [ ] Tableaux de bord pour hôpitaux et donneurs
- [ ] Gestion des profils utilisateurs
- [ ] Notifications en temps réel
- [ ] Visualisation des prédictions IA
- [ ] Interface mobile responsive
- [ ] Mode hors ligne
- [ ] Intégration avec des cartes pour la localisation

## 🤝 Contribution

1. Suivez les standards de codage ci-dessus
2. Créez des composants réutilisables
3. Ajoutez des types TypeScript appropriés
4. Testez vos composants
5. Utilisez des messages de commit descriptifs

