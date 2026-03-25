// routes/hospitalRoutes.js
import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Dashboard hospital
router.get("/:hospitalId/dashboard", async (req, res) => {
  const hospitalId = req.params.hospitalId;
  try {
    // Infos de l'hôpital
    const hospitalQuery = `
      SELECT h.id, u.name, u.email
      FROM hospitals h
      JOIN users u ON h.id = u.id
      WHERE h.id = $1
    `;
    const hospitalResult = await pool.query(hospitalQuery, [hospitalId]);
    if (hospitalResult.rows.length === 0) 
      return res.status(404).json({ error: "Hospital not found" });

    const hospital = hospitalResult.rows[0];

    // Dernières demandes
    const requestsQuery = `
      SELECT id, blood_type, quantity, urgency_level, status, created_at
      FROM blood_requests
      WHERE hospital_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `;
    const requestsResult = await pool.query(requestsQuery, [hospitalId]);

    // Notifications
    const notificationsQuery = `
      SELECT id, message, status, sent_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY sent_at DESC
      LIMIT 10
    `;
    const notificationsResult = await pool.query(notificationsQuery, [hospitalId]);

    res.json({
      hospital,
      requests: requestsResult.rows,
      notifications: notificationsResult.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router; // <-- Export par défaut pour ESM
