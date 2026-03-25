import { useNavigate } from "react-router-dom";

function HospitalDashboard() {
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard Hôpital</h1>
      <p>Bienvenue 👋</p>
      <p>Rôle : {userRole}</p>

      <button
        onClick={() => navigate("/create-request")}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          background: "#A2211B",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        🩸 Créer une demande de sang
      </button>
    </div>
  );
}

export default HospitalDashboard;