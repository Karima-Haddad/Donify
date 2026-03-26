/**
 * ============================================================
 * FILE: bloodRequestTitle.tsx
 * ------------------------------------------------------------
 * Ce composant affiche l’en-tête d’une demande de sang
 * avec son identifiant, son groupe sanguin, son statut
 * et l’action de clôture de la demande.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { closeBloodRequest } from "../api/bloodRequests";
import ConfirmModal from "./ConfirmModal";
import "../styles/bloodRequestTitle.css";

type Props = {
  requestId: string;
  bloodType: string;
  urgency?: "low" | "medium" | "high";
  status: "open" | "in_progress" | "satisfied" | "expired";
  onCloseSuccess?: () => Promise<void> | void;
};

export default function BloodRequestTitle({
  requestId,
  bloodType,
  status,
  onCloseSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [forceClosed, setForceClosed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isClosed =
    forceClosed || status === "satisfied" || status === "expired";

  useEffect(() => {
    if (status === "satisfied" || status === "expired") {
      setForceClosed(true);
    }
  }, [status]);

  const getStatusLabel = () => {
    switch (status) {
      case "open":
        return "Active";
      case "in_progress":
        return "En cours";
      case "satisfied":
        return "Satisfaite";
      case "expired":
        return "Expirée";
    }
  };

  function handleOpenModal() {
    if (isClosed || loading) return;
    setShowConfirmModal(true);
  }

  function handleCloseModal() {
    if (loading) return;
    setShowConfirmModal(false);
  }

  async function handleConfirmCloseRequest() {
    try {
      setLoading(true);

      await closeBloodRequest(requestId);
      setForceClosed(true);

      await onCloseSuccess?.();

      setShowConfirmModal(false);
    } catch (error) {
      console.error("Erreur lors de la clôture de la demande :", error);
      setForceClosed(false);
      alert("Impossible de clôturer la demande.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="request-header">
        <div className="request-header__left">
          <h1 className="request-header__title">
            Demande #{requestId.slice(0, 8)} – Groupe {bloodType}
          </h1>

          <div className="request-header__badges">
            <span className="badge badge--status">{getStatusLabel()}</span>
          </div>
        </div>

        <button
          className="request-header__btn"
          disabled={isClosed || loading}
          onClick={handleOpenModal}
        >
          {loading ? "Clôture..." : "✓ Clôturer la demande"}
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirmer la clôture"
        message="Voulez-vous vraiment clôturer cette demande de sang ? Cette action désactivera le matching et la validation de nouveaux dons pour cette demande."
        confirmText="Oui, clôturer"
        cancelText="Annuler"
        loading={loading}
        onConfirm={handleConfirmCloseRequest}
        onCancel={handleCloseModal}
      />
    </>
  );
}