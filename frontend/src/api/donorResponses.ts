/**
 * Appelle l’API pour envoyer la réponse d’un donneur (acceptation ou refus)
 * à une demande de sang, avec gestion des erreurs côté client.
 */

export type DonorResponseStatus = "accepted" | "refused";

type RespondPayload = {
  request_id: string;
  donor_id: string;
  notification_id: string;
  response_status: DonorResponseStatus;
};

import { http } from "./http";
type ApiResponse = {
  success: boolean;
  message: string;
  data: any;
};

export async function respondToDonationRequest(
  payload: RespondPayload
): Promise<ApiResponse> {
  const { data } = await http.post("/api/donor-responses/respond", payload);
  return data;
}