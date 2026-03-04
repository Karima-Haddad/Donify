import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import pool from "../config/database.js"; // chemin correct si database.js est dans src/config
import authRoutes from "../routes/auth.routes.js"; // ← remonter d'un niveau
import { env } from "../config/env.js";
import pool from "../config/database.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/ai.js";
import matchingRoutes from "../routes/matching_model_routes.js";
import { errorHandler } from "../middleware/error.js"; 


// --------------------------
//importer les variables d'environnement
// --------------------------
dotenv.config();

// --------------------------
//Initialiser l'application express
// --------------------------
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Route santé
app.use(cors()); 
app.use(express.json()); 


const PORT = env.PORT || 4000;
const AI_SERVICE_URL = env.AI_SERVICE_URL;
if (!AI_SERVICE_URL) {
  console.warn("⚠️ WARNING: AI_SERVICE_URL is not defined");
}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`AI Service URL: ${AI_SERVICE_URL}`);
});


// ------------------------
// Test DB à l'initialisation (optionnel, juste log)
// --------------------------
async function logCounts() {
  try {
    const result1 = await pool.query("SELECT COUNT(*) FROM blood_requests");
    const result2 = await pool.query("SELECT COUNT(*) FROM donations");
    console.log("Blood Requests:", result1.rows[0].count);
    console.log("Donations:", result2.rows[0].count);
  } catch (err) {
    console.error("Erreur lors du comptage initial:", err.message || err);
  }
}

logCounts();


// --------------------------
// health check pour le backend et connexion à la base de données
// --------------------------
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "Backend + DB OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Déclaration des routes
app.use("/api/auth", authRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//pour tester une route protegéé 
import authMiddleware from "../middleware/auth.middleware.js";

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome " + req.user.email });
});
// ------------------------
// Routes de santé / test DB
// ------------------------
app.get("/test-db", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ db_time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});



// ------------------------
// Fonction utilitaire optionnelle pour debug dataset
// ------------------------
async function getDataset() {
  try {
    const result = await pool.query(`
      SELECT 
        br.created_at::date AS date,
        br.location_id,
        br.blood_type,
        SUM(br.quantity) AS total_requested,
        COALESCE(SUM(d.volume_ml), 0) AS total_donated
      FROM blood_requests br
      LEFT JOIN donations d 
        ON br.id = d.request_id
      GROUP BY date, br.location_id, br.blood_type
      ORDER BY date
      LIMIT 5
    `);

    console.log("Total rows:", result.rowCount);
    console.log("First 5 rows:", result.rows);
  } catch (err) {
    console.error("Erreur getDataset:", err.message || err);
  }
}

getDataset();

// --------------------------
// Routes
// --------------------------
app.use("/api/matching", matchingRoutes);
app.use("/api/ai", aiRoutes); 


// --------------------------
// Error middleware 
// --------------------------
app.use(errorHandler);
