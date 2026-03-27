/**
 * Valide les données de réponse d’un donneur à une demande de sang
 * puis délègue le traitement au repository pour l’enregistrement
 * et la création de la notification associée.
 */

import { respondToRequestRepository } from "../../repositories/donor_repository.js";

export async function respondToRequestService(data) {
  const { request_id, donor_id, notification_id, response_status } = data;

  // 1. Vérification des champs obligatoires
  if (!request_id) {
    throw new Error("request_id est obligatoire");
  }

  if (!donor_id) {
    throw new Error("donor_id est obligatoire");
  }

  if (!response_status) {
    throw new Error("response_status est obligatoire");
  }

  // 2. Vérification de la valeur autorisée
  if (!["accepted", "refused"].includes(response_status)) {
    throw new Error("response_status invalide");
  }

  // 3. Appel repository
  const result = await respondToRequestRepository({
    request_id,
    donor_id,
    notification_id,
    response_status,
  });

  return result;
}