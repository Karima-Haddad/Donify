import express from "express";
import pool from "../config/database.js";
import { updateDonorProfilController } from "../controllers/donorController.js";

const router = express.Router();

router.get("/:donorId/profil", async (req, res) => {
  const donorId = req.params.donorId;

  try {
    const donorQuery = `
      SELECT 
        d.id,
        u.name,
        u.email,
        u.contact_phone,
        d.gender,
        d.blood_type,
        d.availability,
        d.last_donation_date,
        d.next_eligible_date,
        l.city,
        l.governorate
      FROM donors d
      JOIN users u ON d.id = u.id
      LEFT JOIN locations l ON u.location_id = l.id
      WHERE d.id = $1
    `;

    const donorResult = await pool.query(donorQuery, [donorId]);

    if (donorResult.rows.length === 0) {
      return res.status(404).json({
        error: "Donor not found",
        donorId,
      });
    }

    const donorRow = donorResult.rows[0];

    const donor = {
      id: donorRow.id,
      name: donorRow.name,
      email: donorRow.email,
      contact_phone: donorRow.contact_phone,
      gender: donorRow.gender,
      blood_type: donorRow.blood_type,
      availability: donorRow.availability,
      last_donation_date: donorRow.last_donation_date,
      next_eligible_date: donorRow.next_eligible_date,
      location: {
        city: donorRow.city,
        governorate: donorRow.governorate,
      },
    };

    const statsQuery = `
      SELECT
        COUNT(DISTINCT dn.id) AS total_donations,
        COUNT(DISTINCT CASE 
          WHEN dr.response_status = 'no_response'
           AND br.status IN ('open', 'in_progress')
          THEN dr.id
        END) AS active_requests,
        COALESCE(
          ROUND(
            100.0 * COUNT(DISTINCT CASE WHEN dr.response_status = 'accepted' THEN dr.id END)
            / NULLIF(COUNT(DISTINCT dr.id), 0),
            0
          ),
          0
        ) AS reliability_score
      FROM donors d
      LEFT JOIN donations dn ON dn.donor_id = d.id
      LEFT JOIN donor_responses dr ON dr.donor_id = d.id
      LEFT JOIN blood_requests br ON dr.request_id = br.id
      WHERE d.id = $1
    `;

    const statsResult = await pool.query(statsQuery, [donorId]);

    const responsesQuery = `
      SELECT 
        dr.id,
        dr.response_status,
        dr.sent_at,
        dr.responded_at,
        COALESCE(dr.responded_at, dr.sent_at, dr.created_at) AS date,
        br.blood_type,
        br.quantity,
        br.status AS request_status,
        hu.name AS hospital_name
      FROM donor_responses dr
      JOIN blood_requests br ON dr.request_id = br.id
      JOIN hospitals h ON br.hospital_id = h.id
      JOIN users hu ON h.id = hu.id
      WHERE dr.donor_id = $1
      ORDER BY dr.sent_at DESC
      LIMIT 10
    `;

    const responsesResult = await pool.query(responsesQuery, [donorId]);

    const notificationsQuery = `
      SELECT id, title, message, status, sent_at, type, channel
      FROM notifications
      WHERE user_id = $1
      ORDER BY sent_at DESC
      LIMIT 10
    `;

    const notificationsResult = await pool.query(notificationsQuery, [donorId]);

    res.json({
      donor,
      stats: {
        total_donations: Number(statsResult.rows[0].total_donations) || 0,
        active_requests: Number(statsResult.rows[0].active_requests) || 0,
        reliability_score: Number(statsResult.rows[0].reliability_score) || 0,
      },
      recent_requests: responsesResult.rows,
      notifications: notificationsResult.rows,
    });
  } catch (err) {
    console.error("Erreur dashboard donor :", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id/profil", updateDonorProfilController);

export default router;