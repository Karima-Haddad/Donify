// backend/controllers/donationController.js
import * as donationService from "../src/services/donationService.js";
 
// ── Historique des dons du donneur connecté ───────────────────────────────
export const getMyDonations = async (req, res) => {
  try {
    // donor_id récupéré depuis le token JWT via authMiddleware
    const donor_id = req.user.id;
 
    if (req.user.role !== "donor") {
      return res.status(403).json({
        error: "Accès refusé. Seuls les donneurs peuvent accéder à cet historique."
      });
    }
 
    const { donations, total } = await donationService.getDonationHistory(donor_id);
 
    res.status(200).json({ donations, total });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
 