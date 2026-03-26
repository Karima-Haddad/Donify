import { getRecentBloodRequestsByHospital,closeBloodRequestById,findBloodRequestById } from "../../repositories/BloodRequestsRepository.js";
import { createNotificationsForDonors } from "./notificationService.js";
import { getTopKDonors } from "./matching_model.js";
import pool from "../../config/database.js";

export async function fetchRecentBloodRequests(hospitalId) {
  if (!hospitalId) {
    const error = new Error("hospitalId est requis");
    error.statusCode = 400;
    throw error;
  }

  return await getRecentBloodRequestsByHospital(hospitalId);
}

export async function closeBloodRequest(requestId) {
  const request = await findBloodRequestById(requestId);

  if (!request) {
    const error = new Error("Demande introuvable.");
    error.status = 404;
    throw error;
  }

  if (request.status === "satisfied" || request.status === "expired") {
    const error = new Error("Cette demande est déjà clôturée.");
    error.status = 400;
    throw error;
  }

  const updatedRequest = await closeBloodRequestById(requestId);
  return updatedRequest;
}


export async function createBloodRequestWithNotifications(data) {
  const client = await pool.connect();

  let newRequest;
  let donors = [];

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO blood_requests (
        hospital_id,
        blood_type,
        quantity,
        urgency_level,
        status,
        location_id,
        created_at
      )
      VALUES ($1, $2, $3, $4, 'open', $5, NOW())
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [
      data.hospital_id,
      data.blood_type,
      data.quantity,
      data.urgency_level,
      data.location_id,
    ]);

    newRequest = result.rows[0];

    await client.query("COMMIT");

    try {
      donors = await getTopKDonors(
        newRequest.blood_type,
        100,
        newRequest.id
      );

      await client.query("BEGIN");

      await createNotificationsForDonors(client, {
        bloodRequest: newRequest,
        donors,
      });

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Erreur lors du process TopK/notifications :", error);
    }

    return {
      bloodRequest: newRequest,
      notifiedDonorsCount: donors.length,
    };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {}

    throw error;
  } finally {
    client.release();
  }
}