// backend/routes/bloodRequest.routes.js
import express from "express";
import {
  createBloodRequest,
  getMyBloodRequests,
  getBloodRequestById
} from "../controllers/bloodRequestController.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Toutes les routes sont protégées par authMiddleware
// L'hôpital doit être connecté pour accéder à ces endpoints

// POST /api/blood-requests/create → créer une demande
router.post("/create", authMiddleware, createBloodRequest);

// GET /api/blood-requests/my → récupérer les demandes de l'hôpital connecté
router.get("/my", authMiddleware, getMyBloodRequests);

// GET /api/blood-requests/:id → récupérer une demande par ID
router.get("/:id", authMiddleware, getBloodRequestById);

export default router;