/**
 * MatchingTable
 * -------------
 * Cette page récupère, au chargement, la liste des donneurs compatibles
 * classés par le modèle du matching.
 * et les transmet les donneurs au composant d’affichage (CompatibleDonorsTable)
 */
import { useEffect, useState } from "react";
import { fetchTopKDonors } from "../api/matching";
import type { Donor } from "../types/matching";
import CompatibleDonorsTable from "./CompatibleDonorsTable";

export default function MatchingTable() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchTopKDonors({
        blood_type: "O+",
        k : 100,
        request_id: "f66e3ced-8647-4fce-90d5-7513084a022e",
      });
      setDonors(data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return <CompatibleDonorsTable donors={donors} />;
}