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

// export async function updateHospitalProfilRepository(hospitalId, data) {
//   const {
//     name,
//     email,
//     phone,
//   } = data;

//   // 🔥 update USERS (car hospital = users)
//   await pool.query(
//     `
//     UPDATE users
//     SET name = $1,
//         email = $2,
//         contact_phone = $3
//     WHERE id = $4
//     `,
//     [name, email, phone, hospitalId]
//   );

//   return { message: "Hospital profil mis à jour" };
// }



export async function updateHospitalProfilRepository(hospitalId, data) {
  const client = await pool.connect();

  try {
    const {
      name,
      email,
      phone,
      governorate,
      city,
      currentPassword,
      newPassword,
    } = data;

    const bcryptModule = await import("bcrypt");
    const bcrypt = bcryptModule.default || bcryptModule;

    if (!currentPassword || currentPassword.trim() === "") {
      throw new Error("Le mot de passe actuel est obligatoire");
    }

    const userResult = await client.query(
      `
      SELECT id, password_hash, location_id
      FROM users
      WHERE id = $1
      `,
      [hospitalId]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Utilisateur introuvable");
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isMatch) {
      throw new Error("Mot de passe actuel incorrect");
    }

    let hashedPassword = null;
    if (newPassword && newPassword.trim() !== "") {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    await client.query("BEGIN");

    if (hashedPassword) {
      await client.query(
        `
        UPDATE users
        SET name = $1,
            email = $2,
            contact_phone = $3,
            password_hash = $4,
            updated_at = now()
        WHERE id = $5
        `,
        [name, email, phone, hashedPassword, hospitalId]
      );
    } else {
      await client.query(
        `
        UPDATE users
        SET name = $1,
            email = $2,
            contact_phone = $3,
            updated_at = now()
        WHERE id = $4
        `,
        [name, email, phone, hospitalId]
      );
    }

    if (city || governorate) {
      if (user.location_id) {
        await client.query(
          `
          UPDATE locations
          SET city = $1,
              governorate = $2
          WHERE id = $3
          `,
          [city || null, governorate || null, user.location_id]
        );
      } else {
        const locationResult = await client.query(
          `
          INSERT INTO locations (city, governorate)
          VALUES ($1, $2)
          RETURNING id
          `,
          [city || null, governorate || null]
        );

        const newLocationId = locationResult.rows[0].id;

        await client.query(
          `
          UPDATE users
          SET location_id = $1,
              updated_at = now()
          WHERE id = $2
          `,
          [newLocationId, hospitalId]
        );
      }
    }

    await client.query("COMMIT");

    return { message: "Profil hôpital mis à jour avec succès" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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