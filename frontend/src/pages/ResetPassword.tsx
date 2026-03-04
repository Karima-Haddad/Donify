import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import "../styles/resetPassword.css";

function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      await resetPassword(token!, password); // token et password envoyés au backend
      alert("Mot de passe modifié avec succès !");
      navigate("/login"); // redirige vers login
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.");
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

          <button type="submit" className="reset-button">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
