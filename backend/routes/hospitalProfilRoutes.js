/**
 * Routes du dashboard hôpital
 * Ce fichier définit les endpoints liés au tableau de bord
 * de l'hôpital ainsi que la récupération des demandes récentes.
 */

import express from "express";
import { getRecentRequests } from "../controllers/bloodRequestController.js";
import { getHospitalProfilController } from "../controllers/hospitalProfilController.js";
import { updateHospitalProfilController } from "../controllers/hospitalProfilController.js";
import { getHospitalDashboardController } from "../controllers/hospitalProfilController.js";


const router = express.Router();

// Endpoint pour récupérer les indicateurs du dashboard d’un hôpital
router.get("/hospitals/:hospitalId/profil", getHospitalProfilController);

router.get("/hospitals/:hospitalId/dashboard", getHospitalDashboardController);


// Endpoint pour récupérer les 5 dernières demandes d’un hôpital
router.get("/blood-requests/recent/:hospitalId", getRecentRequests);

//router.get("/:id/profil", getHospitalProfilController);
//router.put("/:id/profil", updateHospitalProfilController);
router.put("/hospitals/:hospitalId/profil", updateHospitalProfilController);


export default router;