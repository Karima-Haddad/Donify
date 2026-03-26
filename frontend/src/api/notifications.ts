const API_URL = import.meta.env.VITE_API_URL;

export type HospitalNotification = {
  id: string;
  title: string | null;
  message: string;
  status: "read" | "unread";
  sent_at: string | null;
  read_at: string | null;
  type: string | null;
};

export async function fetchUnreadNotificationsCount(userId: string): Promise<number> {
  const response = await fetch(`${API_URL}/api/notifications/${userId}/unread-count`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du compteur des notifications.");
  }

  const data = await response.json();
  return data.unreadCount;
}

export async function fetchUserNotifications(
  userId: string
): Promise<HospitalNotification[]> {
  const response = await fetch(`${API_URL}/api/notifications/${userId}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des notifications.");
  }

  const data = await response.json();
  return data.notifications;
}

export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const response = await fetch(`${API_URL}/api/notifications/${userId}/read-all`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour des notifications.");
  }

  const data = await response.json();
  return data.updatedCount;
}