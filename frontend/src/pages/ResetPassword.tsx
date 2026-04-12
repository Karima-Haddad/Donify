import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import "../styles/resetPassword.css";

function ResetPassword() {
  // ✅ Récupération du token depuis l'URL (?token=...)
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔍 DEBUG (très important)
  console.log("URL:", window.location.href);
  console.log("TOKEN:", token);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❗ Vérification token
    if (!token) {
      alert("Lien invalide ou expiré !");
      return;
    }

    // ❗ Vérification mots de passe
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères !");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, password);

      alert("Mot de passe modifié avec succès !");

      // 🔁 redirection vers login
      navigate("/");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Erreur lors de la réinitialisation du mot de passe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-body">
      <div className="reset-card">
        <h2>Réinitialiser le mot de passe</h2>

        <form onSubmit={handleReset}>
          <div className="input-group">
            <label>Nouveau mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmer le mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="show-password-toggle">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">
              Afficher les mots de passe
            </label>
          </div>

          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? "Chargement..." : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
