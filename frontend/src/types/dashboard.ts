/**
 * Types du dashboard hôpital
 * Ce fichier définit la structure des données
 * reçues depuis l'API backend.
 */

export type CriticalStock = {
  blood_type: string | null;
  current_stock_bags: number;
};

export type HospitalDashboardData = {
  hospital_id: string;
  active_requests: number;
  validated_donations: number;
  response_rate: number;
  critical_stock: CriticalStock;
};