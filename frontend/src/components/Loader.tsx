/*
 * Affiche un indicateur de chargement centré avec un message.
 *
 * Utilisation :
 * - Chargement des données API
 * - Attente de traitement IA
 */

import "../styles/Loader.css";

type Props = {
  message?: string;
};

export default function Loader({ message = "Chargement des données..." }: Props) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
}