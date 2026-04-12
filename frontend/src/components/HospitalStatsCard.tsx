import { FaList, FaCheckCircle, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import type { HospitalDashboardData } from "../types/dashboard";
import "../styles/HospitalStatsCard.css";

type Props = {
  data: HospitalDashboardData;
};

export default function HospitalStatsCard({ data }: Props) {
  return (
    <div className="stats">
      <div className="card">
        <FaList className="card-icon" />
        <h3>Demandes actives</h3>
        <div className="value">{data.active_requests}</div>
      </div>

      <div className="card">
        <FaCheckCircle className="card-icon" />
        <h3>Dons validés</h3>
        <div className="value">{data.validated_donations}</div>
      </div>

      <div className="card">
        <FaChartLine className="card-icon" />
        <h3>Taux de réponse</h3>
        <div className="value">{data.response_rate}%</div>
      </div>

      <div className="card">
        <FaExclamationTriangle className="card-icon" />
        <h3>Stock critique</h3>
        <div className="value">
          {data.critical_stock?.blood_type ?? "—"}
        </div>
      </div>
    </div>
  );
}