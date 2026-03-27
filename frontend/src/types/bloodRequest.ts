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

export type BloodRequest = {
  id: string;
  quantity: number;
  needed_date: string;
  city: string;
  service: string;
  notes: string;
  blood_type: string;
  urgency_level: "low" | "medium" | "high";
  status: "open" | "in_progress" | "satisfied" | "expired";
};


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


export type CloseBloodRequestResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: "open" | "in_progress" | "satisfied" | "expired";
    closed_at: string | null;
  };
};