import express from "express";
import { getUserNotifications, getUnreadNotificationsCount,markAllNotificationsAsRead } from "../controllers/notificationController.js";

const router = express.Router();

/**
 * Retourne toutes les notifications d'un utilisateur
 */
router.get("/:userId", getUserNotifications);

/**
 * Retourne le nombre de notifications non lues
 */
router.get("/:userId/unread-count", getUnreadNotificationsCount);

router.patch("/:userId/read-all", markAllNotificationsAsRead);

export default router;