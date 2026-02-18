import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "../config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "Backend + DB OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
