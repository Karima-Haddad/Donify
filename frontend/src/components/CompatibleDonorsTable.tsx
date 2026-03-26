import { useState } from "react";
import type { Donor, ValidatedDonation } from "../types/matching";
import { validateDonation } from "../api/matching";
import "../styles/CompatiblesDonorsTable.css";

interface Props {
  donors: Donor[];
  requestId: string;
  validatedDonations: ValidatedDonation[];
  onDonationValidated: (donation: ValidatedDonation) => void;
}

export default function CompatibleDonorsTable({
  donors,
  requestId,
  validatedDonations,
  onDonationValidated,
}: Props) {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [volumeMl, setVolumeMl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleOpenValidation(donor: Donor) {
    setSelectedDonor(donor);
    setVolumeMl("");
    setError("");
    setShowModal(true);
  }

  function handleCloseModal() {
    if (submitting) return;
    setShowModal(false);
    setSelectedDonor(null);
    setVolumeMl("");
    setError("");
  }

  async function handleConfirmValidation() {
    const parsedVolume = Number(volumeMl);

    if (!volumeMl.trim()) {
      setError("Le volume est obligatoire.");
      return;
    }

    if (Number.isNaN(parsedVolume) || parsedVolume <= 0) {
      setError("Le volume doit être un nombre positif.");
      return;
    }

    if (!selectedDonor) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await validateDonation({
        donor_id: selectedDonor.donor_id,
        request_id: requestId,
        volume_ml: parsedVolume,
      });

      onDonationValidated({
        donor_id: selectedDonor.donor_id,
        public_id: selectedDonor.public_id,
        blood_type: selectedDonor.blood_type,
        gender: selectedDonor.gender,
        age: selectedDonor.age,
        phone: selectedDonor.phone,
        volume_ml: parsedVolume,
        request_id: requestId,
        donation_date: response?.donation?.donation_date ?? new Date().toISOString(),
      });

      handleCloseModal();
    } catch (err) {
      console.error("Erreur validation:", err);
      setError("Erreur lors de la validation du don.");
    } finally {
      setSubmitting(false);
    }
  }

  function isDonorValidated(publicId: string) {
    return validatedDonations.some((donation) => donation.public_id === publicId);
  }

  return (
    <div className="card">
      <h2>Donneurs compatibles</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Public</th>
              <th>Genre</th>
              <th>Groupe</th>
              <th>Âge</th>
              <th>Contact</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {donors.map((d) => {
              const isValidated = isDonorValidated(d.public_id);

              return (
                <tr
                  key={d.public_id}
                  className={isValidated ? "row-validated" : ""}
                >
                  <td data-label="ID">{d.public_id}</td>
                  <td data-label="Genre">{d.gender}</td>
                  <td data-label="Groupe">{d.blood_type}</td>
                  <td data-label="Âge">{d.age}</td>
                  <td data-label="Téléphone">{d.phone || "N/A"}</td>
                  <td data-label="Score" className="score">
                    {Math.round(d.proba_accept * 100)}%
                  </td>
                  <td data-label="Action">
                    {isValidated ? (
                      <span className="badge-validated">Validé</span>
                    ) : (
                      <button
                        className="btn-validate"
                        onClick={() => handleOpenValidation(d)}
                      >
                        Valider
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && selectedDonor && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Valider le don</h3>

            <p>
              Donneur sélectionné : <strong>{selectedDonor.public_id}</strong>
            </p>

            <label htmlFor="volumeMl">Volume du don (ml)</label>
            <input
              id="volumeMl"
              type="number"
              min="1"
              value={volumeMl}
              onChange={(e) => setVolumeMl(e.target.value)}
              placeholder="Ex: 450"
              disabled={submitting}
            />

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={handleCloseModal}
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                className="btn-confirm"
                onClick={handleConfirmValidation}
                disabled={submitting}
              >
                {submitting ? "Enregistrement..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}