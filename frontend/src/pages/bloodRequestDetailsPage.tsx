// /**
//  * PAGE - BloodRequestDetailsPage
//  * ------------------------------------------------------------
//  * Cette page affiche les détails d’une demande de sang :
//  * - titre de la demande
//  * - informations détaillées
//  * - matching des donneurs compatibles
//  */

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchBloodRequestById } from "../api/bloodRequests";
// import BloodRequestTitle from "../components/bloodRequestTitle";
// import BloodRequestInfoCard from "../components/BloodRequestInfoCard";
// import MatchingTable from "../components/MatchingTable";
// import type { BloodRequest } from "../types/bloodRequest";

// export default function BloodRequestDetailsPage() {
//   const { requestId } = useParams();
//   const [request, setRequest] = useState<BloodRequest | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         if (!requestId) {
//           setError("ID de demande invalide");
//           return;
//         }

//         setLoading(true);
//         const data = await fetchBloodRequestById(requestId);
//         setRequest(data);
//       } catch (err) {
//         console.error(err);
//         setError("Erreur lors du chargement");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, [requestId]);

//   if (loading) {
//     return (
//       <p style={{ textAlign: "center", marginTop: "20px" }}>
//         Chargement en cours...
//       </p>
//     );
//   }

//   if (error) return <p>{error}</p>;
//   if (!request) return <p>Aucune donnée</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <BloodRequestTitle
//         requestId={requestId!}
//         bloodType={request.blood_type}
//         status={request.status}
//         onCloseSuccess={loadData}
//       />

//       <BloodRequestInfoCard request={request} />

//       <MatchingTable
//         requestStatus={request.status}
//         bloodType={request.blood_type}
//       />
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBloodRequestById } from "../api/bloodRequests";
import BloodRequestTitle from "../components/bloodRequestTitle";
import BloodRequestInfoCard from "../components/BloodRequestInfoCard";
import MatchingTable from "../components/MatchingTable";
import type { BloodRequest } from "../types/bloodRequest";

export default function BloodRequestDetailsPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      if (!requestId) {
        setError("ID de demande invalide");
        return;
      }

      setError(null);
      setLoading(true);

      const data = await fetchBloodRequestById(requestId);
      setRequest(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [requestId]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Chargement en cours...
      </p>
    );
  }

  if (error) return <p>{error}</p>;
  if (!request) return <p>Aucune donnée</p>;

  return (
    <div style={{ padding: "20px" }}>
      <BloodRequestTitle
        requestId={request.id}
        bloodType={request.blood_type}
        status={request.status}
        onCloseSuccess={loadData}
      />

      <BloodRequestInfoCard request={request} />

      <MatchingTable
        requestStatus={request.status}
        bloodType={request.blood_type}
      />
    </div>
  );
}