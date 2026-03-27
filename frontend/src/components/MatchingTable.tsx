/*
 * Ce composant affiche :
 * - les dons validés
 * - les donneurs compatibles (Top-K)
 *
 * Le requestId est récupéré dynamiquement depuis l’URL.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTopKDonors, fetchValidatedDonations } from "../api/matching";
import type { Donor, ValidatedDonation } from "../types/matching";
import CompatibleDonorsTable from "./CompatibleDonorsTable";
import ValidatedDonationsList from "./ValidatedDonationsList";
import Loader from "./Loader";

type Props = {
  requestStatus: "open" | "in_progress" | "satisfied" | "expired";
  bloodType: string;
};

export default function MatchingTable({ requestStatus, bloodType }: Props) {
  const { requestId } = useParams();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [validatedDonations, setValidatedDonations] = useState<ValidatedDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isClosed =
    requestStatus === "satisfied" || requestStatus === "expired";

  useEffect(() => {
    if (!requestId) {
      setLoading(false);
      setError("ID de demande invalide.");
      return;
    }

    const currentRequestId = requestId;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Toujours charger les dons validés
        const validatedData = await fetchValidatedDonations(currentRequestId);
        setValidatedDonations(validatedData);

        // Si la demande est clôturée, ne pas appeler le matching AI
        if (isClosed) {
          setDonors([]);
          return;
        }

        // Sinon charger les donneurs compatibles
        const donorsData = await fetchTopKDonors({
          blood_type: bloodType,
          k: 100,
          request_id: currentRequestId,
        });

        setDonors(donorsData);
      } catch (error) {
        console.error("Erreur chargement matching :", error);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [requestId, bloodType, isClosed]);

  const availableDonors = donors.filter(
    (donor) =>
      !validatedDonations.some(
        (donation) => donation.donor_id === donor.donor_id
      )
  );

  if (!requestId) {
    return <div>ID de demande invalide.</div>;
  }

  if (loading) {
    return <Loader message="Analyse des donneurs en cours..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }
  

  return (
    <>
      <ValidatedDonationsList donations={validatedDonations} />

      {isClosed ? (
        <div className="card">
          <h2>Donneurs compatibles</h2>
          <p>Cette demande est clôturée. Ce service n'est plus disponible.</p>
        </div>
      ) : (
        <CompatibleDonorsTable
          donors={availableDonors}
          requestId={requestId}
          validatedDonations={validatedDonations}
          isClosed={isClosed}
          onDonationValidated={(newDonation) =>
            setValidatedDonations((prev) => [newDonation, ...prev])
          }
        />
      )}
    </>
  );
}