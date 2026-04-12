import pool from "../config/database.js";

export async function getHospitalProfilRepository(hospitalId) {
  // 🔹 Récupérer les infos de l'hôpital depuis users
  const hospitalResult = await pool.query(
    `
    SELECT u.id, u.name, u.email, u.contact_phone
    FROM hospitals h
    JOIN users u ON h.id = u.id
    WHERE h.id = $1
    `,
    [hospitalId]
  );

  if (hospitalResult.rows.length === 0) {
    throw new Error("Hôpital introuvable");
  }

  const hospital = hospitalResult.rows[0];

  // 🔹 Statistiques
  const activeRequestsResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM blood_requests
    WHERE hospital_id = $1
      AND status IN ('open', 'in_progress')
    `,
    [hospitalId]
  );

  const validatedDonationsResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM donations d
    JOIN blood_requests br ON d.request_id = br.id
    WHERE br.hospital_id = $1
      AND d.validated_by_hospital = true
    `,
    [hospitalId]
  );

  const responseRateResult = await pool.query(
    `
    SELECT 
      CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(
          100.0 * COUNT(*) FILTER (WHERE dr.response_status IN ('accepted', 'refused'))
          / COUNT(*),
          2
        )
      END AS response_rate
    FROM donor_responses dr
    JOIN blood_requests br ON dr.request_id = br.id
    WHERE br.hospital_id = $1
    `,
    [hospitalId]
  );

  const criticalStockResult = await pool.query(
    `
    SELECT blood_type, current_stock_bags
    FROM hospital_blood_stock
    WHERE hospital_id = $1
    ORDER BY current_stock_bags ASC
    LIMIT 1
    `,
    [hospitalId]
  );

  return {
    hospital: {
      id: hospital.id,
      name: hospital.name,
      email: hospital.email,
      contact_phone: hospital.contact_phone || "—",
    },
    requests: [], // tu peux ensuite ajouter un SELECT pour les demandes si nécessaire
    notifications: [], // pareil pour notifications
    stats: {
      active_requests: parseInt(activeRequestsResult.rows[0].count),
      validated_donations: parseInt(validatedDonationsResult.rows[0].count),
      response_rate: parseFloat(responseRateResult.rows[0].response_rate),
      critical_stock: criticalStockResult.rows[0] || { blood_type: null, current_stock_bags: 0 },
    },
  };
}


export async function updateHospitalProfilRepository(hospitalId, data) {
  const {
    name,
    email,
    phone,
  } = data;

  // 🔥 update USERS (car hospital = users)
  await pool.query(
    `
    UPDATE users
    SET name = $1,
        email = $2,
        contact_phone = $3
    WHERE id = $4
    `,
    [name, email, phone, hospitalId]
  );

  return { message: "Hospital profil mis à jour" };
}