# 🎨 Frontend Donify

Application React + Vite + TypeScript pour la plateforme de gestion des dons de sang Donify.

## 📋 Vue d'ensemble

Le frontend fournit une interface utilisateur moderne et réactive pour la gestion des dons de sang. Il permet aux donneurs, hôpitaux et administrateurs d'interagir avec la plateforme via une interface web intuitive. L'application communique avec le backend via des APIs REST et intègre des visualisations des prédictions IA.

## 🏗 Architecture

- **Framework** : React 19 avec hooks
- **Outil de build** : Vite pour un développement rapide
- **Langage** : TypeScript pour la sécurité des types
- **Routing** : React Router DOM pour la navigation
- **HTTP Client** : Axios pour les appels API
- **Styling** : Tailwind CSS et CSS natif
- **Configuration** : Vite + TypeScript

## 📂 Structure du projet

```
frontend/
├── .dockerignore
├── .env
├── .gitignore
├── Dockerfile
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── assets/          # Ressources statiques
└── src/
    ├── api/             # Clients et helpers API
    ├── assets/          # Images et médias
    ├── components/      # Composants réutilisables
    ├── data/            # Jeux de données de démonstration
    ├── layouts/         # Composants de mise en page
    ├── pages/           # Pages de l'application
    ├── services/        # Logique de services
    ├── styles/          # Styles et utilitaires CSS
    ├── types/           # Types TypeScript
    ├── App.css
    ├── App.tsx
    ├── index.css
    └── main.tsx
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

## 🐳 Dockerisation

1. Construction de l'image

Depuis le dossier `frontend/` :
```bash
docker build -t donify-frontend .
```

2. Lancement du conteneur

```bash
docker run -d -p 5173:80 --name donify-frontend-container donify-frontend
```
3. Vérification

```bash
docker ps
```

Exemple de sortie :
```bash
CONTAINER ID   IMAGE             COMMAND                  CREATED             STATUS             PORTS                                         NAMES
b110b95999a4   donify-frontend   "/docker-entrypoint.…"   4 seconds ago       Up 3 seconds       0.0.0.0:5173->80/tcp, [::]:5173->80/tcp       donify-frontend-container
```

4. Logs

```bash
docker logs donify-frontend-container
```

5. Arrêt du conteneur

```bash
docker stop donify-frontend-container
```

6. Démarrage du conteneur

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

## 📦 Dépendances

### Production
- `react` - Bibliothèque UI
- `react-dom` - Rendu React
- `react-router-dom` - Routing
- `axios` - Client HTTP
- `lucide-react` - Icônes React
- `react-icons` - Icônes React
- `sweetalert2` - Alert React

### Développement
- `@eslint/js` - Config ESLint pour JavaScript
- `@types/node` - Types Node.js
- `@types/react` - Types React
- `@types/react-dom` - Types React DOM
- `@vitejs/plugin-react` - Plugin Vite pour React
- `autoprefixer` - Gestion CSS pour Tailwind
- `eslint` - Linting
- `eslint-plugin-react-hooks` - Règles React Hooks
- `eslint-plugin-react-refresh` - Plugin React Refresh
- `globals` - Variables globales partagées
- `postcss` - Transformations CSS
- `tailwindcss` - Framework CSS utilitaire
- `typescript` - TypeScript
- `typescript-eslint` - Intégration ESLint TypeScript
- `vite` - Outil de build
