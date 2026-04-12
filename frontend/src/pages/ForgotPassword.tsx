import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import "../styles/forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Veuillez entrer votre email.");
      return;
    }

    try {
      await forgotPassword(email);
      setMessage("Email envoyé ! Vérifiez votre boîte mail.");
      setEmail("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors de l'envoi du mail."
      );
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2>Mot de passe oublié</h2>
        <p>Entrez votre email pour recevoir un lien de réinitialisation.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "#D94F4F", marginBottom: "15px" }}>{error}</p>}
          {message && <p style={{ color: "green", marginBottom: "15px" }}>{message}</p>}

          <button type="submit" className="forgot-button">
            Envoyer le lien
          </button>
        </form>

        <div className="back">
          <Link to="/">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
