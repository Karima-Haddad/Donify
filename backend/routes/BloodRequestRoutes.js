import express from "express";
import { getBloodRequestById , closeBloodRequestController, createBloodRequest} from "../controllers/BloodRequestsController.js";

const router = express.Router();

// Récupérer les détails d’une demande
router.get("/:requestId", getBloodRequestById);


// Clôturer une demande
router.patch("/:requestId/close", closeBloodRequestController);


router.post("/", createBloodRequest);


export default router;