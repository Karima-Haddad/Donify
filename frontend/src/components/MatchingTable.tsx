import { useEffect, useState } from "react";
import { fetchTopKDonors, fetchValidatedDonations } from "../api/matching";
import type { Donor, ValidatedDonation } from "../types/matching";
import CompatibleDonorsTable from "./CompatibleDonorsTable";
import ValidatedDonationsList from "./ValidatedDonationsList";

export default function MatchingTable() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [validatedDonations, setValidatedDonations] = useState<ValidatedDonation[]>([]);
  const [loading, setLoading] = useState(true);

  const requestId = "f66e3ced-8647-4fce-90d5-7513084a022e";

  useEffect(() => {
    async function load() {
      try {
        const [donorsData, validatedData] = await Promise.all([
          fetchTopKDonors({
            blood_type: "O+",
            k: 100,
            request_id: requestId,
          }),
          fetchValidatedDonations(requestId),
        ]);

        setDonors(donorsData);
        setValidatedDonations(validatedData);
      } catch (error) {
        console.error("Erreur chargement matching:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [requestId]);

  const availableDonors = donors.filter(
    (donor) =>
      !validatedDonations.some(
        (donation) => donation.donor_id === donor.donor_id
      )
  );

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      <ValidatedDonationsList donations={validatedDonations} />

      <CompatibleDonorsTable
        donors={availableDonors}
        requestId={requestId}
        validatedDonations={validatedDonations}
        onDonationValidated={(newDonation) =>
          setValidatedDonations((prev) => [newDonation, ...prev])
        }
      />
    </>
  );
}