import { useState } from "react";
import type { Donor, ValidatedDonation } from "../types/matching";
import { validateDonation } from "../api/matching";
import "../styles/CompatiblesDonorsTable.css";

interface Props {
  donors: Donor[];
  requestId: string;
  validatedDonations: ValidatedDonation[];
  isClosed: boolean;
  onDonationValidated: (donation: ValidatedDonation) => void;
}

function formatGender(gender: string | null | undefined) {
  if (!gender) return "N/A";

  const value = gender.trim().toLowerCase();

  if (value === "male" || value === "m") return "Homme";
  if (value === "female" || value === "f") return "Femme";

  return gender;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const startIndex = lowerText.indexOf(lowerQuery);

  if (startIndex === -1) return text;

  const endIndex = startIndex + query.length;

  return (
    <>
      {text.slice(0, startIndex)}
      <mark className="highlight-id">{text.slice(startIndex, endIndex)}</mark>
      {text.slice(endIndex)}
    </>
  );
}

export default function CompatibleDonorsTable({
  donors,
  requestId,
  validatedDonations,
  isClosed,
  onDonationValidated,
}: Props) {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [volumeMl, setVolumeMl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredDonors = donors.filter((donor) =>
    donor.public_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">

      <div className="card-header">
        <h2>Donneurs compatibles</h2>

        <input
          type="text"
          placeholder="Rechercher par ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="table-search-input"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Genre</th>
              <th>Groupe sanguin</th>
              <th>Âge</th>
              <th>Téléphone</th>
              <th title="Probabilité d’acceptation du don">Score (%)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredDonors.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  Aucun donneur trouvé.
                </td>
              </tr>
            ) : (
              filteredDonors.map((d) => {
                const isValidated = isDonorValidated(d.public_id);

                return (
                  <tr
                    key={d.public_id}
                    className={isValidated ? "row-validated" : ""}
                  >
                    <td data-label="ID">
                      {highlightMatch(d.public_id, searchTerm)}
                    </td>
                    <td data-label="Genre">{formatGender(d.gender)}</td>
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
                          disabled={isClosed}
                        >
                          {isClosed ? "Indisponible" : "Valider"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
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