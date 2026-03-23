import type { ValidatedDonation } from "../types/matching";
import "../styles/ValidatedDonationsList.css";

interface Props {
  donations: ValidatedDonation[];
}

export default function ValidatedDonationsList({ donations }: Props) {
  return (
    <div className="card">
      <h2>Dons validés</h2>

      {donations.length === 0 ? (
        <p>Aucun don validé pour le moment.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID Public</th>
                <th>Genre</th>
                <th>Groupe</th>
                <th>Âge</th>
                <th>Contact</th>
                <th>Volume (ml)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={`${d.donor_id}-${d.request_id}-${d.donation_date}`}>
                  <td>{d.public_id}</td>
                  <td>{d.gender}</td>
                  <td>{d.blood_type}</td>
                  <td>{d.age}</td>
                  <td>{d.phone || "N/A"}</td>
                  <td>{d.volume_ml}</td>
                  <td>{new Date(d.donation_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}