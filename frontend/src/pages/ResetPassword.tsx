import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import Swal from "sweetalert2";
import "../styles/resetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Lien invalide",
        text: "Le lien est invalide ou expiré.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Mots de passe différents",
        text: "Les mots de passe ne correspondent pas.",
        confirmButtonText: "Réessayer",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "info",
        title: "Mot de passe trop court",
        text: "Le mot de passe doit contenir au moins 6 caractères.",
        confirmButtonText: "D'accord",
      });
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, password);

      await Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Votre mot de passe a été modifié avec succès.",
        confirmButtonText: "Se connecter",
        confirmButtonColor: "#dc2626",
        background: "#ffffff",
        color: "#1f2937",
      });

      navigate("/");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Lien invalide",
        text: "Le lien est invalide ou expiré.",
        confirmButtonColor: "#dc2626",
      });
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
            <label htmlFor="showPassword">Afficher les mots de passe</label>
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