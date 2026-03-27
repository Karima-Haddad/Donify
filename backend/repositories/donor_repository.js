import pool from "../config/database.js";

/**
 * Récupère les donneurs disponibles pour un groupe sanguin donné
 * et calcule les principales features utiles au moteur de matching,
 * comme l’âge, la fiabilité, la distance et le niveau de sollicitation.
 */

export async function findAvailableDonorsByBloodType(bloodType, requestId) {
  const query = `
    WITH req_loc AS (
      SELECT l.latitude AS req_lat, l.longitude AS req_lon
      FROM blood_requests br
      JOIN locations l ON l.id = br.location_id
      WHERE br.id = $2
    ),
    notif_agg AS (
      SELECT
        n.user_id AS donor_id,
        COUNT(*) FILTER (WHERE n.sent_at >= NOW() - INTERVAL '7 days')  AS notif_last_7_days,
        COUNT(*) FILTER (WHERE n.sent_at >= NOW() - INTERVAL '30 days') AS notif_last_30_days,
        COUNT(*) AS total_notifications
      FROM notifications n
      GROUP BY n.user_id
    ),
    resp_agg AS (
      SELECT
        dr.donor_id,
        COUNT(*) FILTER (WHERE dr.response_status = 'accepted') AS total_accepted
      FROM donor_responses dr
      GROUP BY dr.donor_id
    )
    SELECT
      d.id,
      d.gender,
      d.blood_type AS donor_blood_type,
      EXTRACT(YEAR FROM AGE(d.date_of_birth))::int AS age,
      COALESCE(EXTRACT(DAY FROM NOW() - d.last_donation_date), 0)::int AS days_since_last_donation,
      CASE WHEN d.last_donation_date IS NULL THEN 1 ELSE 0 END AS never_donated,

      --  notified_
      EXTRACT(HOUR FROM NOW())::int AS notified_hour,
      EXTRACT(DOW  FROM NOW())::int AS notified_weekday,

      -- agrégations 
      COALESCE(na.notif_last_7_days, 0)::int  AS notif_last_7_days,
      COALESCE(na.notif_last_30_days, 0)::int AS notif_last_30_days,

      --  reliability = acceptations / notifications
      COALESCE(
        (COALESCE(ra.total_accepted,0)::float) / NULLIF(COALESCE(na.total_notifications,0), 0),
        0
      ) AS donor_reliability,

      --  distance_km (Haversine) :
      (
        6371 * 2 * ASIN(
          SQRT(
            POWER(SIN(RADIANS((dl.latitude - rl.req_lat) / 2)), 2) +
            COS(RADIANS(rl.req_lat)) * COS(RADIANS(dl.latitude)) *
            POWER(SIN(RADIANS((dl.longitude - rl.req_lon) / 2)), 2)
          )
        )
      )::float AS distance_km

    FROM donors d
    JOIN users u ON u.id = d.id
    JOIN locations dl ON dl.id = u.location_id
    CROSS JOIN req_loc rl
    LEFT JOIN notif_agg na ON na.donor_id = d.id
    LEFT JOIN resp_agg  ra ON ra.donor_id = d.id

    WHERE d.blood_type = $1
      AND d.availability = true
      AND (d.next_eligible_date IS NULL OR d.next_eligible_date <= NOW())
  `;

  const { rows } = await pool.query(query, [bloodType, requestId]);

  // fatigue_score calcul côté JS (simple & flexible)
  return rows.map((donor) => {
    const fatigue =
      0.6 * (Number(donor.notif_last_7_days) / 5) +
      0.4 * (Number(donor.notif_last_30_days) / 15);

    return {
      ...donor,
      fatigue_score: Math.min(fatigue, 1),
      // casts utiles (au cas où)
      donor_reliability: Number(donor.donor_reliability),
      distance_km: Number(donor.distance_km),
    };
  });
}



/**
 * Gère la réponse d’un donneur à une demande de sang :
 * enregistre la réponse dans la base de données et envoie
 * une notification à l’hôpital concerné, le tout dans une transaction sécurisée.
 */

export async function respondToRequestRepository({
    request_id,
    donor_id,
    notification_id,
    response_status,
  }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // ================================
      // 1. Vérifier la demande + récupérer hôpital
      // ================================
      const requestResult = await client.query(
        `
        SELECT hospital_id, blood_type
        FROM blood_requests
        WHERE id = $1
        `,
        [request_id]
      );

      if (requestResult.rows.length === 0) {
        throw new Error("Blood request not found");
      }

      const { hospital_id, blood_type } = requestResult.rows[0];

      // ================================
      // 2. Récupérer public_id du donneur
      // ================================
      const donorResult = await client.query(
        `
        SELECT public_id
        FROM users
        WHERE id = $1
        `,
        [donor_id]
      );

      if (donorResult.rows.length === 0) {
        throw new Error("Donor not found");
      }

      const { public_id } = donorResult.rows[0];

      // ================================
      // 3. Enregistrer la réponse
      // ================================
      const responseResult = await client.query(
        `
        INSERT INTO donor_responses (
          id,
          request_id,
          donor_id,
          notification_id,
          response_status,
          sent_at,
          responded_at,
          created_at
        )
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          $3,
          $4,
          NOW(),
          NOW(),
          NOW()
        )
        RETURNING *
        `,
        [request_id, donor_id, notification_id || null, response_status]
      );

      // ================================
      // 4. Construire message notification
      // ================================
      let title = "";
      let message = "";

      if (response_status === "accepted") {
        title = "Donneur disponible";
        message = `Le donneur ${public_id} a accepté votre demande de sang ${blood_type}.`;
      } else {
        title = "Donneur indisponible";
        message = `Le donneur ${public_id} a refusé votre demande de sang ${blood_type}.`;
      }

      // ================================
      // 5. Créer notification pour hôpital
      // ================================
      const notificationResult = await client.query(
        `
        INSERT INTO notifications (
          id,
          user_id,
          request_id,
          type,
          title,
          message,
          status,
          channel,
          sent_at
        )
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          'donation_response',
          $3,
          $4,
          'unread',
          'in_app',
          NOW()
        )
        RETURNING *
        `,
        [hospital_id, request_id, title, message]
      );

      await client.query("COMMIT");

      return {
        donor_response: responseResult.rows[0],
        hospital_notification: notificationResult.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
}