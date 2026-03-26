import { getNotificationsByUserId,
    countUnreadNotificationsByUserId,
    markAllNotificationsAsReadByUserId,
    insertNotification} from "../../repositories/notificationRepository.js";

/**
 * Retourne la liste des notifications d'un utilisateur.
 */
export async function fetchUserNotifications(userId) {
  return await getNotificationsByUserId(userId);
}

/**
 * Retourne le nombre de notifications non lues d'un utilisateur.
 */
export async function fetchUnreadNotificationsCount(userId) {
  return await countUnreadNotificationsByUserId(userId);
}

export async function markAllUserNotificationsAsRead(userId) {
  return await markAllNotificationsAsReadByUserId(userId);
}

export async function createNotificationsForDonors(client, { bloodRequest, donors }) {
  if (!donors || donors.length === 0) return;

  // 🔥 récupérer le nom de l'hôpital
  const { rows } = await client.query(
    `SELECT name FROM users WHERE id = $1`,
    [bloodRequest.hospital_id]
  );

  const hospitalName = rows[0]?.name || "un hôpital";

  for (const donor of donors) {
    try {
      // 🎯 message dynamique selon urgence
      let message = "";

      if (bloodRequest.urgency_level === "high") {
        message = `🚨 URGENT — L’hôpital ${hospitalName} a un besoin critique de sang de groupe ${bloodRequest.blood_type}. Si vous êtes disponible, votre don est essentiel.`;
      } else if (bloodRequest.urgency_level === "medium") {
        message = `L’hôpital ${hospitalName} recherche des donneurs de groupe ${bloodRequest.blood_type}. Si vous êtes disponible, votre contribution est précieuse.`;
      } else {
        message = `L’hôpital ${hospitalName} a besoin de sang de groupe ${bloodRequest.blood_type}. Si vous êtes disponible pour un don, votre contribution peut sauver des vies.`;
      }

      await insertNotification(client, {
        userId: donor.donor_id,
        requestId: bloodRequest.id,
        type: "blood_request_match",
        title: "Nouvelle demande de don de sang",
        message,
        status: "unread",
        channel: "in_app",
      });

    } catch (error) {
      console.error(
        "Erreur insertion notification pour donor :",
        donor.donor_id,
        error.message
      );
    }
  }

  console.log(`Notifications créées pour ${donors.length} donneurs`);
}