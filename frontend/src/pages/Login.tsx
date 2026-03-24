import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/donify-logo.jpeg";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      const { token, role, id } = res.data;

      if (!token || !role || !id) {
        alert("Erreur : données de connexion invalides");
        return;
      }

      // stockage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      const userRole = role.trim().toLowerCase();

      // redirection
      if (userRole === "hospital") {
        navigate("/hospital-dashboard");
      } else if (userRole === "donor") {
        navigate("/donor-dashboard");
      } else {
        alert("Rôle inconnu");
      }

    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur login");
    }
  };

  return (
    <div className="login-container">

      {/* GAUCHE */}
      <div className="login-left">
        <div className="logo-container">
          <img src={logo} alt="Donify Logo" className="logo" />
        </div>

        <div className="tagline">Connecting Blood. Saving Lives.</div>

        <div className="presentation">
          <h2>Une plateforme intelligente de mise en relation</h2>
          <p>
            Donify connecte rapidement donneurs volontaires et hôpitaux grâce à un matching intelligent prenant en compte groupe sanguin, localisation et disponibilité réelle.
          </p>

          <div className="stats">
            <div className="stat-card">
              <h3>+1 200</h3>
              <span>Donneurs actifs</span>
            </div>
            <div className="stat-card">
              <h3>+350</h3>
              <span>Dons validés</span>
            </div>
            <div className="stat-card">
              <h3>98 %</h3>
              <span>Taux de réponse</span>
            </div>
          </div>
        </div>
      </div>

      {/* DROITE */}
      <div className="login-right">
        <div className="form-card">
          <h2>Connexion</h2>

          <form onSubmit={handleLogin}>
            
            {/* EMAIL */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD + ICON */}
            <div className="form-group password-group">
              <label>Mot de passe</label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* FORGOT */}
            <div className="forgot-password">
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </div>

            {/* BUTTON */}
            <button type="submit" className="login-button">
              Se connecter
            </button>

            {/* REGISTER */}
            <div className="register-link">
              <p>Pas encore de compte ?</p>
              <Link to="/register">Créer un compte</Link>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;
