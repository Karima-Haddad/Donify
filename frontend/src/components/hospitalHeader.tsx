import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/hospitalHeader.css";
import logo from "../assets/donify-logo.jpeg";
import { Bell, User, LogOut } from "lucide-react";
import {
  fetchUnreadNotificationsCount,
  fetchUserNotifications,
  markAllNotificationsAsRead,
  type HospitalNotification,
} from "../api/notifications.js";

type Props = {
  hospitalId: string;
  hospitalName: string;
};

export default function HospitalHeader({
  hospitalId,
  hospitalName,
}: Props) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const count = await fetchUnreadNotificationsCount(hospitalId);
        setUnreadCount(count);
      } catch (error) {
        console.error("Erreur compteur notifications :", error);
      }
    }

    if (hospitalId) {
      loadUnreadCount();
    }
  }, [hospitalId]);

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
    if (!hospitalId) return;

    const intervalId = setInterval(async () => {
      try {
        const count = await fetchUnreadNotificationsCount(hospitalId);
        setUnreadCount(count);

        if (isNotificationsOpen) {
          const data = await fetchUserNotifications(hospitalId);
          setNotifications(data);
        }
      } catch (error) {
        console.error("Erreur rafraîchissement notifications :", error);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [hospitalId, isNotificationsOpen]);

  async function handleToggleNotifications() {
    const nextOpenState = !isNotificationsOpen;

    if (isNotificationsOpen && unreadCount > 0) {
      try {
        await markAllNotificationsAsRead(hospitalId);

        setUnreadCount(0);

        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            status: "read",
            read_at: new Date().toISOString(),
          }))
        );
      } catch (error) {
        console.error("Erreur mark as read :", error);
      }
    }

    setIsNotificationsOpen(nextOpenState);

    if (nextOpenState) {
      try {
        setLoadingNotifications(true);
        const data = await fetchUserNotifications(hospitalId);
        setNotifications(data);
      } catch (error) {
        console.error("Erreur chargement notifications :", error);
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

  const hospitalInitial = hospitalName?.trim()?.charAt(0)?.toUpperCase() || "H";


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
    <header className="hospital-header">
      <div className="hospital-header__left">
        <div className="hospital-header__logo-icon">
          <img src={logo} alt="Donify Logo" className="logo" />
        </div>
      </div>

      <NavLink
        to="/hospital-dashboard"
        className={({ isActive }) =>
          isActive
            ? "hospital-header__link hospital-header__link--active"
            : "hospital-header__link"
        }
      >
        Accueil
      </NavLink>

      <NavLink
        to="/create-request"
        className={({ isActive }) =>
          isActive
            ? "hospital-header__link hospital-header__link--active"
            : "hospital-header__link"
        }
      >
        Nouvelle demande
      </NavLink>

      <NavLink
        to="/my-requests"
        className={({ isActive }) =>
          isActive
            ? "hospital-header__link hospital-header__link--active"
            : "hospital-header__link"
        }
      >
        Mes demandes
      </NavLink>

      <div className="hospital-header__right">
        <div className="hospital-header__notification-wrapper" ref={notificationRef}>
          <button
            type="button"
            className="hospital-header__notification"
            onClick={handleToggleNotifications}
          >
            <Bell
              size={35}
              strokeWidth={2.2}
              className="hospital-header__bell-icon"
            />

            {unreadCount > 0 && (
              <span className="hospital-header__badge">{unreadCount}</span>
            )}
          </button>

          {isNotificationsOpen && (
            <div
              className={`hospital-header__notifications-panel ${
                isNotificationsOpen
                  ? "hospital-header__notifications-panel--open"
                  : ""
              }`}
            >
              <div className="hospital-header__notifications-header">
                <h3>Notifications</h3>
              </div>

              <div className="hospital-header__notifications-list">
                {loadingNotifications ? (
                  <p className="hospital-header__notifications-empty">
                    Chargement...
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="hospital-header__notifications-empty">
                    Aucune notification
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`hospital-header__notification-item ${
                        notification.status === "unread"
                          ? "hospital-header__notification-item--unread"
                          : ""
                      }`}
                    >
                      <div className="hospital-header__notification-item-top">
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

        <div className="hospital-header__profile-wrapper">
          <div className="hospital-header__avatar">{hospitalInitial}</div>

          <div className="hospital-header__profile-menu">
            <button className="hospital-header__menu-item" type="button">
              <User
                size={20}
                strokeWidth={2.3}
                className="hospital-header__menu-svg"
              />
              <span>Profil {hospitalName}</span>
            </button>

            <button
              className="hospital-header__menu-item hospital-header__menu-item--logout"
              type="button"
              onClick={handleLogout}
            >
              <LogOut
                size={20}
                strokeWidth={2.3}
                className="hospital-header__menu-svg"
              />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}