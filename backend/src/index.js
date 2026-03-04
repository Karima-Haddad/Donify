import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "../config/database.js"; // chemin correct si database.js est dans src/config
import authRoutes from "../routes/auth.routes.js"; // ← remonter d'un niveau

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Route santé
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
