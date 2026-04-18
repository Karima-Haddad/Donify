import pool from "../config/database.js";

/**
 * Récupère les notifications d'un utilisateur
 * triées de la plus récente à la plus ancienne.
 */
export async function getNotificationsByUserId(userId) {
  const query = `
  SELECT 
    id,
    request_id,
    title,
    message,
    status,
    sent_at,
    read_at,
    type,
    response_status,
    responded_at
  FROM notifications
  WHERE user_id = $1
  ORDER BY sent_at DESC
`;

  const result = await pool.query(query, [userId]);
  return result.rows;
}

/**
 * Compte le nombre de notifications non lues
 * d'un utilisateur.
 */
export async function countUnreadNotificationsByUserId(userId) {
  const query = `
    SELECT COUNT(*) AS unread_count
    FROM notifications
    WHERE user_id = $1
      AND status = 'unread'
  `;

  const result = await pool.query(query, [userId]);
  return Number(result.rows[0].unread_count);
}


/**
 * Marque toutes les notifications unread d'un utilisateur comme read
 */
export async function markAllNotificationsAsReadByUserId(userId) {
  const query = `
    UPDATE notifications
    SET status = 'read',
        read_at = NOW()
    WHERE user_id = $1
      AND status = 'unread'
    RETURNING id
  `;

  const result = await pool.query(query, [userId]);
  return result.rowCount;
}


export async function insertNotification(
  client,
  {
    userId,
    requestId,
    type,
    title,
    message,
    status = "unread",
    channel = "in_app",
    responseStatus = null,
    respondedAt = null,
  }
) {
  const query = `
    INSERT INTO notifications (
      user_id,
      request_id,
      type,
      title,
      message,
      status,
      channel,
      sent_at,
      response_status,
      responded_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9)
    RETURNING *;
  `;

  const values = [
    userId,
    requestId,
    type,
    title,
    message,
    status,
    channel,
    responseStatus,
    respondedAt,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
}

export async function markNotificationAsResponded(
  notificationId,
  responseStatus
) {
  const query = `
    UPDATE notifications
    SET response_status = $1,
        responded_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [responseStatus, notificationId]);
  return result.rows[0];
}