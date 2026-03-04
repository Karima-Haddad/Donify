
function UserDashboard() {
  const userRole = localStorage.getItem("role");

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard Donneur</h1>
      <p>Bienvenue 👋</p>
      <p>Rôle : {userRole}</p>
    </div>
  );
}

export default UserDashboard;
