

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import logo from "../assets/donify-logo.jpeg";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Veuillez compléter votre email");
      return;
    } else {
      setEmailError("");
    }

    try {
      const res = await loginUser({ email, password });

      console.log("LOGIN RESPONSE :", res.data);

      // ✅ récupérer token + role + userId
      const { token, role, userId, id, name } = res.data;

      // ✅ compatibilité si backend renvoie id au lieu de userId
      const realUserId = userId || id;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (name) {
        localStorage.setItem("userName", name);
      }

      if (realUserId) {
        localStorage.setItem("userId", realUserId);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: realUserId,
            role,
            token,
          })
        );
      }

  

      // 🚀 redirection selon rôle
      if (role === "hospital") {
        navigate("/hospital-dashboard-page");
      } else {
        navigate("/donor-profil");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur login");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT – Présentation */}
      <div className="login-left">
        <div className="logo-container">
          <img src={logo} alt="Donify Logo" className="logo-login" />
        </div>

        <div className="tagline">Votre sang leur espoir</div>

        <div className="presentation">
          <h2>Une plateforme intelligente de mise en relation</h2>
          <p>
            Donify connecte rapidement donneurs volontaires et hôpitaux grâce à
            un matching intelligent prenant en compte groupe sanguin,
            localisation et disponibilité réelle.
          </p>

          <div className="stats">
            <div className="stats-card">
              <h3>+1 200</h3>
              <span>Donneurs actifs</span>
            </div>
            <div className="stats-card">
              <h3>+350</h3>
              <span>Dons validés</span>
            </div>
            <div className="stats-card">
              <h3>98%</h3>
              <span>Taux de réponse</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT – Formulaire */}
      <div className="login-right">
        <div className="form-card">
          <h2>Connexion</h2>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!email) setEmailError("Veuillez compléter votre email");
                  else setEmailError("");
                }}
                required
              />
              {emailError && <span className="error-msg">{emailError}</span>}
            </div>

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
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-10 7-10 7s1.5 3.5 4 5.5l-2.7 2.7 1.4 1.4 16-16-1.4-1.4L16.5 7.4C18 8.2 19 10 19 10s-3 7-7 7c-1.5 0-2.8-.5-3.9-1.3l-1.4 1.4A9.953 9.953 0 0012 19c7 0 10-7 10-7s-1.5-3.5-4-5.5l-1.6 1.6A5.014 5.014 0 0112 5z" />
                  </svg>
                )}
              </span>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" className="login-button">
              Se connecter
            </button>

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