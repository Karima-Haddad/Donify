/*
 * Cette modale affiche une boîte de confirmation réutilisable
 * pour les actions sensibles de l’application.
 */

import "../styles/confirmModal.css"

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal__overlay" onClick={onCancel}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal__icon">!</div>

        <h2 className="confirm-modal__title">{title}</h2>
        <p className="confirm-modal__message">{message}</p>

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Traitement..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}