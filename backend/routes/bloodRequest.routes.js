// backend/routes/bloodRequest.routes.js
import express from "express";
import {
  createBloodRequest,
  getMyBloodRequests,
  getBloodRequestById,
  getMyBloodRequestById ,
  closeBloodRequestController
} from "../controllers/bloodRequestController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes sont protégées par authMiddleware
// L'hôpital doit être connecté pour accéder à ces endpoints

// POST /api/blood-requests/create → créer une demande
router.post("/create", authMiddleware, createBloodRequest);

// GET /api/blood-requests/my → récupérer les demandes de l'hôpital connecté
router.get("/my", authMiddleware, getMyBloodRequests);

// GET /api/blood-requests/:id → récupérer une demande par ID
router.get("/:id", authMiddleware, getBloodRequestById);


// Récupérer les détails d’une demande
router.get("/:requestId", getMyBloodRequestById);

// Clôturer une demande
router.patch("/:requestId/close", closeBloodRequestController);


// router.post("/", createBloodRequestAndNotif);


export default router;