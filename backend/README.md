# 🛠 Donify Backend

Node.js + Express API for Donify.

---

## 🏗 Architecture

- Express REST API
- PostgreSQL via pg
- Supabase Cloud database
- Environment-based configuration
- Modular structure (models, services, controllers)

---

## 📂 Structure

backend/
│
├── src/
│ ├── controllers/
│ ├── services/
│ ├── models/
│ └── index.js
│
├── config/
│ └── database.js
│
├── .env
└── package.json


---

## 🔧 Backend Installation

Initialize project:

    npm init -y

    Install dependencies:

    npm install express pg dotenv cors

Install development dependencies:

    npm install --save-dev nodemon eslint prettier

    Initialize ESLint:

    npx eslint --init


## 🚀 Backend Setup

cd backend  
npm install  

---

## ▶️ Run Development Server

npm run dev


Server runs at:
http://localhost:4000

Health check:
http://localhost:4000/health

---


## 📦 Dependencies

- express → API server
- pg → PostgreSQL client
- dotenv → environment management
- cors → cross-origin requests
- nodemon → development auto-restart

---

## 🧠 Coding Standards

- Use async/await
- Use parameterized queries
- Keep business logic in services
- Keep routes thin
- Validate inputs before DB operations

---

## 🔮 Planned Features

- JWT authentication
- Role-based access control
- Transaction support
- Logging system
- Error middleware
---

## Seed Users

Script:
`backend/scripts/seed-users.js`

Sample data:
`backend/data/users.seed.json`

Run:
```
node backend/scripts/seed-users.js backend/data/users.seed.json
```

JSON format:
- Array of users or `{ "users": [...] }`
- Required fields: `email`, `password_hash`, `role`
- For `role: "donor"` you must include `donor.blood_type`
- Dates accept `YYYY-MM-DD`
