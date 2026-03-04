

function HospitalDashboard() {
  const userRole = localStorage.getItem("role");

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard Hôpital</h1>
      <p>Bienvenue 👋</p>
      <p>Rôle : {userRole}</p>
    </div>
  );
}

export default HospitalDashboard;
