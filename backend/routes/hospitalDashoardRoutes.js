/**
 * Routes du dashboard hôpital
 * Ce fichier définit les endpoints liés au tableau de bord
 * de l'hôpital ainsi que la récupération des demandes récentes.
 */

import express from "express";
import { getHospitalDashboardController } from "../controllers/hospitalDashboardController.js";
import { getRecentRequests } from "../controllers/BloodRequestsController.js";

const router = express.Router();

// Endpoint pour récupérer les indicateurs du dashboard d’un hôpital
router.get("/hospitals/:hospitalId/dashboard", getHospitalDashboardController);

// Endpoint pour récupérer les 5 dernières demandes d’un hôpital
router.get("/blood-requests/recent/:hospitalId", getRecentRequests);

export default router;