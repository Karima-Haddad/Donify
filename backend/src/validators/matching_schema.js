/**
 * Schéma de validation pour une requête de matching.
 * Vérifie le groupe sanguin, le Top-K optionnel
 * et l’ID UUID de la demande de sang.
 */

import { z } from "zod";

export const matchingSchema = z.object({
  blood_type: z.enum([
    "A+","A-",
    "B+","B-",
    "AB+","AB-",
    "O+","O-"
  ]),

  k: z
    .number()
    .int()
    .positive()
    .max(1000)
    .optional(),
    
  request_id: z.string().uuid()
});