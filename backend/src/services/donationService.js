// backend/src/services/donationService.js
import * as donationRepo from "../../repositories/donation_repository.js";
 
// ── Récupérer l'historique des dons d'un donneur ──────────────────────────
export const getDonationHistory = async (donor_id) => {
  const donations = await donationRepo.getDonationsByDonor(donor_id);
  const total     = await donationRepo.countDonationsByDonor(donor_id);
  return { donations, total };
};
 