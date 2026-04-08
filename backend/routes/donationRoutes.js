// backend/routes/donationRoutes.js
import express from "express";
import { getMyDonations } from "../controllers/donationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
 
const router = express.Router();
 
// GET /api/donations/my → historique des dons du donneur connecté
router.get("/my", authMiddleware, getMyDonations);
 
export default router;
 