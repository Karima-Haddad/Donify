import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/donorHeader.css";
import logo from "../assets/donify-logo.jpeg";
import {
  fetchUnreadNotificationsCount,
  fetchUserNotifications,
  markAllNotificationsAsRead,
  type HospitalNotification,
} from "../api/notifications";

type Props = {
  donorId: string;
  donorName?: string;
};

export default function DonorHeader({ donorId, donorName = "Donneur" }: Props) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  const initial = donorName.trim().charAt(0).toUpperCase() || "D";

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const count = await fetchUnreadNotificationsCount(donorId);
        setUnreadCount(count);
      } catch (error) {
        console.error("Erreur compteur notifications donneur :", error);
      }
    }

    if (donorId) {
      loadUnreadCount();
    }
  }, [donorId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!donorId) return;

    const intervalId = setInterval(async () => {
      try {
        const count = await fetchUnreadNotificationsCount(donorId);
        setUnreadCount(count);

        if (isNotificationsOpen) {
          const data = await fetchUserNotifications(donorId);
          setNotifications(data);
        }
      } catch (error) {
        console.error("Erreur rafraîchissement notifications donneur :", error);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [donorId, isNotificationsOpen]);

  async function handleToggleNotifications() {
    const nextOpenState = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpenState);

    if (nextOpenState) {
      try {
        setLoadingNotifications(true);

        const data = await fetchUserNotifications(donorId);
        setNotifications(data);

        if (unreadCount > 0) {
          await markAllNotificationsAsRead(donorId);

          setUnreadCount(0);

          setNotifications((prev) =>
            prev.map((notification) => ({
              ...notification,
              status: "read",
              read_at: new Date().toISOString(),
            }))
          );
        }
      } catch (error) {
        console.error("Erreur chargement notifications donneur :", error);
      } finally {
        setLoadingNotifications(false);
      }
    }
  }

  function formatNotificationDate(dateString: string | null) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }


  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    localStorage.clear();

    navigate("/");
  };
  return (
    <header className="donor-header">
      <div className="donor-header__left">
        <div className="donor-header__logo-icon">
          <img src={logo} alt="Donify Logo" className="donor-header__logo" />
        </div>
      </div>

      <nav className="donor-header__nav">
        <Link to="/donor-dashboard" className="donor-header__link donor-header__link--active">
          Acceuil
        </Link>

        <Link to="/donor-notifications" className="donor-header__link">
          Mes Dons
        </Link>
      </nav>

      <div className="donor-header__right">
        <div className="donor-header__notification-wrapper" ref={notificationRef}>
          <button
            type="button"
            className="donor-header__notification"
            onClick={handleToggleNotifications}
          >
            <Bell size={34} strokeWidth={2.2} className="donor-header__bell-icon" />

            {unreadCount > 0 && (
              <span className="donor-header__badge">{unreadCount}</span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="donor-header__notifications-panel">
              <div className="donor-header__notifications-header">
                <h3>Notifications</h3>
              </div>

              <div className="donor-header__notifications-list">
                {loadingNotifications ? (
                  <p className="donor-header__notifications-empty">Chargement...</p>
                ) : notifications.length === 0 ? (
                  <p className="donor-header__notifications-empty">
                    Aucune notification
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`donor-header__notification-item ${
                        notification.status === "unread"
                          ? "donor-header__notification-item--unread"
                          : ""
                      }`}
                    >
                      <div className="donor-header__notification-item-top">
                        <h4>{notification.title || "Notification"}</h4>
                        <span>{formatNotificationDate(notification.sent_at)}</span>
                      </div>

                      <p>{notification.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="donor-header__profile-wrapper">
          <div className="donor-header__avatar">{initial}</div>

          <div className="donor-header__profile-menu">
            <button className="donor-header__menu-item" type="button">
              <User size={20} strokeWidth={2.3} className="donor-header__menu-svg" />
              <span>Mon profil</span>
            </button>

            <button
              className="donor-header__menu-item donor-header__menu-item--logout"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={20} strokeWidth={2.3} className="donor-header__menu-svg" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}