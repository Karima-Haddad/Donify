import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { env } from "../config/env.js";
import pool from "../config/database.js";
import matchingRoutes from "../routes/matching_model_routes.js";
import { errorHandler } from "../middleware/error.js"; 


//importer les variables d'environnement
dotenv.config();

//Initialiser l'application express
const app = express();
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

// health check pour le backend et connexion à la base de données
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "Backend + DB OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// routes
app.use("/api/matching", matchingRoutes);


// error middleware 
app.use(errorHandler);
