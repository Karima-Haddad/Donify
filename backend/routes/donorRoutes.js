// routes/donorRoutes.js
import express from "express";
import pool from "../../config/database.js"; // attention à mettre .js si tu es en ESM

const router = express.Router();

// Récupérer le dashboard d'un donor
router.get("/:donorId/dashboard", async (req, res) => {
  const donorId = req.params.donorId;
  try {
    const donorQuery = `
      SELECT d.id, u.name, u.email, d.gender, d.blood_type, d.availability
      FROM donors d
      JOIN users u ON d.id = u.id
      WHERE d.id = $1
    `;
    const donorResult = await pool.query(donorQuery, [donorId]);

    if (donorResult.rows.length === 0) return res.status(404).json({ error: "Donor not found" });

    const donor = donorResult.rows[0];

    const responsesQuery = `
      SELECT dr.id, dr.response_status, dr.sent_at, dr.responded_at,
             br.blood_type, br.quantity, br.status as request_status
      FROM donor_responses dr
      JOIN blood_requests br ON dr.request_id = br.id
      WHERE dr.donor_id = $1
      ORDER BY dr.sent_at DESC
      LIMIT 10
    `;
    const responsesResult = await pool.query(responsesQuery, [donorId]);

    const notificationsQuery = `
      SELECT id, message, status, sent_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY sent_at DESC
      LIMIT 10
    `;
    const notificationsResult = await pool.query(notificationsQuery, [donorId]);

    res.json({
      donor,
      responses: responsesResult.rows,
      notifications: notificationsResult.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router; // <-- export par défaut pour ESM
