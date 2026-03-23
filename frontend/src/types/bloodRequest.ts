/**
 * ============================================================
 * TYPES - Blood Requests
 * ------------------------------------------------------------
 * Ce fichier définit les types TypeScript utilisés pour
 * représenter les données des demandes de sang.
 *
 * - RecentBloodRequest : structure d’une demande
 * - RecentBloodRequestsResponse : réponse API
 * ============================================================
 */

export type RecentBloodRequest = {
  id: string;
  blood_type: string;
  created_at: string;
  status: "open" | "in_progress" | "satisfied" | "expired";
};

export type RecentBloodRequestsResponse = {
  success: boolean;
  data: RecentBloodRequest[];
};