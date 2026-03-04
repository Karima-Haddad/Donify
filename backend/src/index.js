import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "../config/database.js";
import aiRoutes from "./routes/ai.js";

// ✅ Charger dotenv avant toute utilisation
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------
// Test DB à l'initialisation (optionnel, juste log)
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

// ------------------------
// Routes de santé / test DB
// ------------------------
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "Backend + DB OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

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
// Routes AI
// ------------------------
app.use("/api/ai", aiRoutes);  // inclut maintenant /predict-shortage ET /predict-from-db

// ------------------------
// Lancement serveur
// ------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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