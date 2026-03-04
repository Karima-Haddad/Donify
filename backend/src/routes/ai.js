import express from "express";
import pool from "../../config/database.js";

const router = express.Router();

router.get("/predict-from-db", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        location_id,
        blood_type,
        predicted_quantity,
        risk_level,
        confidence,
        prediction_date,
        model_version
      FROM ai_shortage_predictions
      ORDER BY prediction_date DESC
    `);

    const formatted = result.rows.map((row) => {
      let riskLabel;

      if (row.risk_level >= 0.8) riskLabel = "Critique";
      else if (row.risk_level >= 0.5) riskLabel = "Modéré";
      else riskLabel = "Faible";

      return {
        blood_type: row.blood_type,
        risk_probability: row.risk_level,
        risk_label: riskLabel,
        predicted_quantity: row.predicted_quantity,
        prediction_date: row.prediction_date,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Prediction from DB failed:", error);
    res.status(500).json({
      error: "Prediction from DB failed",
      details: error.message,
    });
  }
});

export default router;