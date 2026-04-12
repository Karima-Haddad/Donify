import pool from "../config/database.js";

export async function getHospitalProfilRepository(hospitalId) {
  // 🔹 Infos hôpital
  const hospitalResult = await pool.query(
    `
    SELECT 
      u.id,
      u.public_id,
      u.name,
      u.email,
      u.contact_phone,
      u.created_at,
      u.updated_at,
      l.city,
      l.governorate
    FROM hospitals h
    JOIN users u ON h.id = u.id
    LEFT JOIN locations l ON u.location_id = l.id
    WHERE h.id = $1
    `,
    [hospitalId]
  );

  if (hospitalResult.rows.length === 0) {
    throw new Error("Hôpital introuvable");
  }

  const hospital = hospitalResult.rows[0];

  // 🔹 Total demandes publiées
  const totalRequestsResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM blood_requests
    WHERE hospital_id = $1
    `,
    [hospitalId]
  );

  // 🔹 Demandes actives
  const activeRequestsResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM blood_requests
    WHERE hospital_id = $1
      AND status IN ('open', 'in_progress')
    `,
    [hospitalId]
  );

  // 🔹 Dons validés
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

  // 🔹 Taux de réponse des donneurs
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

  // 🔹 Groupe sanguin le plus critique
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

  // 🔹 Retour final
  return {
    hospital: {
      id: hospital.id,
      public_id: hospital.public_id,
      name: hospital.name,
      email: hospital.email,
      contact_phone: hospital.contact_phone || "—",
      created_at: hospital.created_at,
      updated_at: hospital.updated_at,
      city: hospital.city || "—",
      governorate: hospital.governorate || "—",
    },

    requests: [],        // tu peux ajouter plus tard
    notifications: [],   // idem

    stats: {
      total_requests: parseInt(totalRequestsResult.rows[0].count),
      active_requests: parseInt(activeRequestsResult.rows[0].count),
      validated_donations: parseInt(validatedDonationsResult.rows[0].count),
      response_rate: parseFloat(responseRateResult.rows[0].response_rate),
      critical_stock:
        criticalStockResult.rows[0] || {
          blood_type: null,
          current_stock_bags: 0,
        },
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



export async function getHospitalDashboardRepository(hospitalId) {
  // 1. Demandes actives
  const activeRequestsResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM blood_requests
    WHERE hospital_id = $1
      AND status IN ('open', 'in_progress')
    `,
    [hospitalId]
  );

  const activeRequests = parseInt(activeRequestsResult.rows[0].count);

  // 2. Dons validés
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

  const validatedDonations = parseInt(validatedDonationsResult.rows[0].count);

  // 3. Taux de réponse
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

  const responseRate = parseFloat(responseRateResult.rows[0].response_rate);

  // 4. Stock critique
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

  const criticalStock = criticalStockResult.rows[0] || {
    blood_type: null,
    current_stock_bags: 0,
  };

  // Résultat final
  return {
    hospital_id: hospitalId,
    active_requests: activeRequests,
    validated_donations: validatedDonations,
    response_rate: responseRate,
    critical_stock: criticalStock,
  };
}