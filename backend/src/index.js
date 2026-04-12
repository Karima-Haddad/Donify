import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import pool from "../config/database.js"; 
import authRoutes from "../routes/authRoutes.js";
import { env } from "../config/env.js";
import { errorHandler } from "../middleware/error.js"; 
import authMiddleware from "../middleware/authMiddleware.js";
import matchingRoutes from "../routes/matching_model_routes.js";
import shortageRoutes from "../routes/shortage_model_routes.js";
import hospitalProfilRoutes from "../routes/hospitalProfilRoutes.js";
import donorRoutes from "../routes/donorRoutes.js";
import hospitalRoutes from "../routes/hospitalRoutes.js";

// --------------------------
// Charger les variables d'environnement
// --------------------------
dotenv.config();

// --------------------------
// Initialiser Express
// --------------------------
const app = express();

app.use(cors());
app.use(express.json());

// --------------------------
// Variables
// --------------------------
const PORT = env.PORT || 4000;
const AI_SERVICE_URL = env.AI_SERVICE_URL;

if (!AI_SERVICE_URL) {
  console.warn("⚠️ WARNING: AI_SERVICE_URL is not defined");
}


// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "Backend + DB OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Profile sécurisé
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome " + req.user.email });
});

// Test DB
app.get("/test-db", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ db_time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// --------------------------
// Debug dataset (optionnel)
// --------------------------
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
// Log counts (optionnel)
// --------------------------
app.use("/api/auth", authRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/shortage", shortageRoutes);
app.use("/api", hospitalProfilRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/hospital", hospitalRoutes);


// --------------------------
// Error middleware 
// --------------------------
app.use(errorHandler);


// --------------------------
// Lancer serveur 
// --------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🤖 AI Service URL: ${AI_SERVICE_URL}`);
});
