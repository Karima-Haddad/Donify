/**
 * CompatibleDonorsTable
 * ----------------------
 * Composant d’affichage présentant la liste des donneurs compatibles
 * retournés par le service de matching IA.
 * Ce composant est purement visuel (pas de logique métier).
 */
import { useState } from "react";
import type { Donor } from "../types/matching";
import "../styles/CompatiblesDonorsTable.css";

interface Props {
  donors: Donor[];
}
export default function CompatibleDonorsTable({ donors }: Props) {

  const [validatedId, setValidatedId] = useState<string | null>(null);
  console.log(donors);

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

                const isValidated = validatedId === d.public_id;

                return (
                <tr 
                    key={d.public_id}
                    className={isValidated ? "row-validated" : ""}
                >
                    <td data-label="ID">{d.public_id}</td>
                    <td data-label="Genre">{d.gender}</td>
                    <td data-label="Groupe">{d.blood_type}</td>
                    <td data-label="Âge" >{d.age}</td>
                    <td data-label="Téléphone">{d.phone || "N/A"}</td>

                    <td data-label="Score" className="score">
                    {Math.round(d.proba_accept * 100)}%
                    </td>

                    <td data-label="Action">
                    {isValidated ? (
                        <span className="badge-validated">
                        Validé
                        </span>
                    ) : (
                        <button 
                        className="btn-validate"
                        onClick={() => setValidatedId(d.public_id)}
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
    </div>
  );
}