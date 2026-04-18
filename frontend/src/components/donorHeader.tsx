

// import { useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// import { Bell, User, LogOut } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import "../styles/donorHeader.css";
// import logo from "../assets/donify-logo.jpeg";
// import {
//   fetchUnreadNotificationsCount,
//   fetchUserNotifications,
//   markAllNotificationsAsRead,
//   type HospitalNotification,
// } from "../api/notifications";
// import { respondToDonationRequest } from "../api/donorResponses";

// type Props = {
//   donorId: string;
//   donorName?: string;
// };

// export default function DonorHeader({ donorId, donorName = "Donneur" }: Props) {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//   const [loadingNotifications, setLoadingNotifications] = useState(false);
//   const [submittingId, setSubmittingId] = useState<string | null>(null);
//   const [answeredNotifications, setAnsweredNotifications] = useState<
//     Record<string, "accepted" | "refused">
//   >({});


//   const notificationRef = useRef<HTMLDivElement | null>(null);

//   const initial = donorName.trim().charAt(0).toUpperCase() || "D";
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function loadUnreadCount() {
//       try {
//         const count = await fetchUnreadNotificationsCount(donorId);
//         setUnreadCount(count);
//       } catch (error) {
//         console.error("Erreur compteur notifications donneur :", error);
//       }
//     }

//     if (donorId) {
//       loadUnreadCount();
//     }
//   }, [donorId]);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(event.target as Node)
//       ) {
//         setIsNotificationsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (!donorId) return;

//     const intervalId = setInterval(async () => {
//       try {
//         const count = await fetchUnreadNotificationsCount(donorId);
//         setUnreadCount(count);

//         if (isNotificationsOpen) {
//           const data = await fetchUserNotifications(donorId);


//           setNotifications(data);
//         }
//       } catch (error) {
//         console.error("Erreur rafraîchissement notifications donneur :", error);
//       }
//     }, 10000);

//     return () => clearInterval(intervalId);
//   }, [donorId, isNotificationsOpen]);


// async function handleToggleNotifications() {
//     const nextOpenState = !isNotificationsOpen;

//     if (isNotificationsOpen && unreadCount > 0) {
//       try {
//         await markAllNotificationsAsRead(donorId);

//         setUnreadCount(0);

//         setNotifications((prev) =>
//           prev.map((notification) => ({
//             ...notification,
//             status: "read",
//             read_at: new Date().toISOString(),
//           }))
//         );
//       } catch (error) {
//         console.error("Erreur mark as read :", error);
//       }
//     }

//     setIsNotificationsOpen(nextOpenState);

//     if (nextOpenState) {
//       try {
//         setLoadingNotifications(true);
//         const data = await fetchUserNotifications(donorId);
//         setNotifications(data);
//       } catch (error) {
//         console.error("Erreur chargement notifications :", error);
//       } finally {
//         setLoadingNotifications(false);
//       }
//     }
//   }


//   function formatNotificationDate(dateString: string | null) {
//     if (!dateString) return "";

//     return new Date(dateString).toLocaleString("fr-FR", {
//       dateStyle: "short",
//       timeStyle: "short",
//     });
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("role");
//     localStorage.removeItem("username");
//     localStorage.clear();
//     navigate("/");
//   };

//   async function handleRespondToNotification(
//     notificationId: string,
//     requestId: string | null,
//     responseStatus: "accepted" | "refused"
//   ) {
//     if (submittingId) return;
    
//     if (!requestId) {
//       alert("Cette notification n’est liée à aucune demande.");
//       return;
//     }

//     try {
//       setSubmittingId(notificationId);

//       console.log("REPONSE DONNEUR:");
//       console.log("notificationId:", notificationId);
//       console.log("requestId:", requestId);
//       console.log("responseStatus:", responseStatus);
//       console.log("donorId:", donorId);

//       await respondToDonationRequest({
//         request_id: requestId,
//         donor_id: donorId,
//         notification_id: notificationId,
//         response_status: responseStatus,
//       });

//       setAnsweredNotifications((prev) => ({
//         ...prev,
//         [notificationId]: responseStatus,
//       }));

//       setNotifications((prev) =>
//         prev.map((notification) =>
//           notification.id === notificationId
//             ? {
//                 ...notification,
//                 message:
//                   responseStatus === "accepted"
//                     ? `${notification.message}\n\nVous avez accepté cette demande.`
//                     : `${notification.message}\n\nVous avez refusé cette demande.`,
//               }
//             : notification
//         )
//       );
//     } catch (error) {
//       console.error("Erreur réponse donneur :", error);
//       alert("Impossible d’envoyer votre réponse.");
//     } finally {
//       setSubmittingId(null);
//     }
//   }

//   return (
//     <header className="donor-header">
//       <div className="donor-header__left">
//         <div className="donor-header__logo-icon">
//           <img src={logo} alt="Donify Logo" className="donor-header__logo" />
//         </div>
//       </div>

//     <div className="donor-header__center">
//       <NavLink
//         to="/donor-profil"
//         className={({ isActive }) =>
//           isActive
//             ? "donor-header__link donor-header__link--active"
//             : "donor-header__link"
//         }
//       >
//         Accueil
//       </NavLink>

//       <NavLink
//         to="/my-donations"
//         className={({ isActive }) =>
//           isActive
//             ? "donor-header__link donor-header__link--active"
//             : "donor-header__link"
//         }
//       >
//         Mes Dons
//       </NavLink>
//       </div>

//       <div className="donor-header__right">
//         <div
//           className="donor-header__notification-wrapper"
//           ref={notificationRef}
//         >
//           <button
//             type="button"
//             className="donor-header__notification"
//             onClick={handleToggleNotifications}
//           >
//             <Bell
//               size={34}
//               strokeWidth={2.2}
//               className="donor-header__bell-icon"
//             />

//             {unreadCount > 0 && (
//               <span className="donor-header__badge">{unreadCount}</span>
//             )}
//           </button>

//           {isNotificationsOpen && (
//             <div className="donor-header__notifications-panel">
//               <div className="donor-header__notifications-header">
//                 <h3>Notifications</h3>
//               </div>

//               <div className="donor-header__notifications-list">
//                 {loadingNotifications ? (
//                   <p className="donor-header__notifications-empty">
//                     Chargement...
//                   </p>
//                 ) : notifications.length === 0 ? (
//                   <p className="donor-header__notifications-empty">
//                     Aucune notification
//                   </p>
//                 ) : (
//                   notifications.map((notification: HospitalNotification) => {
//                     console.log("TYPE:", notification.type);
//                     console.log("REQUEST_ID:", notification.request_id);
//                     console.log(
//                       "SHOW_BUTTONS:",
//                       notification.type === "blood_request_match" &&
//                         !!notification.request_id
//                     );

//                     return (
//                       <div
//                         key={notification.id}
//                         className={`donor-header__notification-item ${
//                         notification.status === "unread"
//                           ? "donor-header__notification-item--unread"
//                           : ""
//                       }`}
//                       >
//                         <div className="donor-header__notification-item-top">
//                           <h4>{notification.title || "Notification"}</h4>
//                           <span>
//                             {formatNotificationDate(notification.sent_at)}
//                           </span>
//                         </div>

//                         <p>{notification.message}</p>

//                         {
//                           notification.request_id && (
//                             <div className="donor-header__notification-actions">
//                               {answeredNotifications[notification.id] ? (
//   <span className="donor-header__response-badge">
//     {answeredNotifications[notification.id] === "accepted"
//       ? "Demande acceptée"
//       : "Demande refusée"}
//   </span>
// ) : submittingId === notification.id ? (
//   <div className="donor-header__sending-state">
//     <span className="donor-header__spinner"></span>
//     <span>Envoi...</span>
//   </div>
// ) : (
//   <>
//     <button
//       type="button"
//       className="donor-header__action-btn donor-header__action-btn--accept"
//       onClick={() =>
//         handleRespondToNotification(
//           notification.id,
//           notification.request_id,
//           "accepted"
//         )
//       }
//     >
//       Accepter
//     </button>

//     <button
//       type="button"
//       className="donor-header__action-btn donor-header__action-btn--refuse"
//       onClick={() =>
//         handleRespondToNotification(
//           notification.id,
//           notification.request_id,
//           "refused"
//         )
//       }
//     >
//       Refuser
//     </button>
//   </>
// )}
//                             </div>
//                           )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="donor-header__profile-wrapper">
//           <div className="donor-header__avatar">{initial}</div>

//           <div className="donor-header__profile-menu">
//             <button className="donor-header__menu-item" type="button" onClick={() => navigate("/donor-profil")}>
//               <User
//                 size={20}
//                 strokeWidth={2.3}
//                 className="donor-header__menu-svg"
//               />
//               <span>Mon profil</span>
//             </button>

//             <button
//               className="donor-header__menu-item donor-header__menu-item--logout"
//               type="button"
//               onClick={handleLogout}
//             >
//               <LogOut
//                 size={20}
//                 strokeWidth={2.3}
//                 className="donor-header__menu-svg"
//               />
//               <span>Déconnexion</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }



import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import "../styles/donorHeader.css";
import logo from "../assets/donify-logo.jpeg";
import {
  fetchUnreadNotificationsCount,
  fetchUserNotifications,
  markAllNotificationsAsRead,
  type HospitalNotification,
} from "../api/notifications";
import { respondToDonationRequest } from "../api/donorResponses";

type Props = {
  donorId: string;
  donorName?: string;
};

export default function DonorHeader({ donorId, donorName = "Donneur" }: Props) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  const initial = donorName.trim().charAt(0).toUpperCase() || "D";
  const navigate = useNavigate();

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

    if (isNotificationsOpen && unreadCount > 0) {
      try {
        await markAllNotificationsAsRead(donorId);

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
        const data = await fetchUserNotifications(donorId);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.clear();
    navigate("/");
  };

  async function handleRespondToNotification(
    notificationId: string,
    requestId: string | null,
    responseStatus: "accepted" | "refused"
  ) {
    if (submittingId) return;

    if (!requestId) {
      alert("Cette notification n’est liée à aucune demande.");
      return;
    }

    try {
      setSubmittingId(notificationId);

      await respondToDonationRequest({
        request_id: requestId,
        donor_id: donorId,
        notification_id: notificationId,
        response_status: responseStatus,
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                response_status: responseStatus,
                responded_at: new Date().toISOString(),
                message:
                  responseStatus === "accepted"
                    ? `${notification.message}\n\nVous avez accepté cette demande.`
                    : `${notification.message}\n\nVous avez refusé cette demande.`,
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Erreur réponse donneur :", error);
      alert("Impossible d’envoyer votre réponse.");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <header className="donor-header">
      <div className="donor-header__left">
        <div className="donor-header__logo-icon">
          <img src={logo} alt="Donify Logo" className="donor-header__logo" />
        </div>
      </div>

      <div className="donor-header__center">
        <NavLink
          to="/donor-profil"
          className={({ isActive }) =>
            isActive
              ? "donor-header__link donor-header__link--active"
              : "donor-header__link"
          }
        >
          Accueil
        </NavLink>

        <NavLink
          to="/my-donations"
          className={({ isActive }) =>
            isActive
              ? "donor-header__link donor-header__link--active"
              : "donor-header__link"
          }
        >
          Mes Dons
        </NavLink>
      </div>

      <div className="donor-header__right">
        <div
          className="donor-header__notification-wrapper"
          ref={notificationRef}
        >
          <button
            type="button"
            className="donor-header__notification"
            onClick={handleToggleNotifications}
          >
            <Bell
              size={34}
              strokeWidth={2.2}
              className="donor-header__bell-icon"
            />

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
                  <p className="donor-header__notifications-empty">
                    Chargement...
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="donor-header__notifications-empty">
                    Aucune notification
                  </p>
                ) : (
                  notifications.map((notification: HospitalNotification) => {
                    return (
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
                          <span>
                            {formatNotificationDate(notification.sent_at)}
                          </span>
                        </div>

                        <p>{notification.message}</p>

                        {notification.request_id && (
                          <div className="donor-header__notification-actions">
                            {notification.response_status ? (
                              <span className="donor-header__response-badge">
                                {notification.response_status === "accepted"
                                  ? "Demande acceptée"
                                  : "Demande refusée"}
                              </span>
                            ) : submittingId === notification.id ? (
                              <div className="donor-header__sending-state">
                                <span className="donor-header__spinner"></span>
                                <span>Envoi...</span>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="donor-header__action-btn donor-header__action-btn--accept"
                                  onClick={() =>
                                    handleRespondToNotification(
                                      notification.id,
                                      notification.request_id,
                                      "accepted"
                                    )
                                  }
                                >
                                  Accepter
                                </button>

                                <button
                                  type="button"
                                  className="donor-header__action-btn donor-header__action-btn--refuse"
                                  onClick={() =>
                                    handleRespondToNotification(
                                      notification.id,
                                      notification.request_id,
                                      "refused"
                                    )
                                  }
                                >
                                  Refuser
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="donor-header__profile-wrapper">
          <div className="donor-header__avatar">{initial}</div>

          <div className="donor-header__profile-menu">
            <button
              className="donor-header__menu-item"
              type="button"
              onClick={() => navigate("/donor-profil")}
            >
              <User
                size={20}
                strokeWidth={2.3}
                className="donor-header__menu-svg"
              />
              <span>Mon profil</span>
            </button>

            <button
              className="donor-header__menu-item donor-header__menu-item--logout"
              type="button"
              onClick={handleLogout}
            >
              <LogOut
                size={20}
                strokeWidth={2.3}
                className="donor-header__menu-svg"
              />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}