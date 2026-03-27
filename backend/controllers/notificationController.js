import { fetchUserNotifications, fetchUnreadNotificationsCount, markAllUserNotificationsAsRead } from "../src/services/notificationService.js";


/**
 * GET /api/notifications/:userId
 * Retourne toutes les notifications d'un utilisateur.
 */
export async function getUserNotifications(req, res) {
  try {
    const { userId } = req.params;

    const notifications = await fetchUserNotifications(userId);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Erreur getUserNotifications :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des notifications.",
    });
  }
}

/**
 * GET /api/notifications/:userId/unread-count
 * Retourne le nombre de notifications non lues.
 */
export async function getUnreadNotificationsCount(req, res) {
  try {
    const { userId } = req.params;

    const unreadCount = await fetchUnreadNotificationsCount(userId);

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Erreur getUnreadNotificationsCount :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du comptage des notifications non lues.",
    });
  }
}


export async function markAllNotificationsAsRead(req, res) {
  try {
    const { userId } = req.params;

    const updatedCount = await markAllUserNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      updatedCount,
      message: "Notifications marquées comme lues.",
    });
  } catch (error) {
    console.error("Erreur markAllNotificationsAsRead :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour des notifications.",
    });
  }
}