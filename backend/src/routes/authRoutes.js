// backend/src/routes/authRoutes.js
import express from "express";
import {
  registerDonor,
  registerHospital,
  getAllUsers,
  getAllDonors,
  getAllHospitals,
} from "../controllers/authController.js";

const router = express.Router();

// POST
router.post("/register/donor", registerDonor);
router.post("/register/hospital", registerHospital);

// GET (tests uniquement)
router.get("/users", getAllUsers);
router.get("/donors", getAllDonors);
router.get("/hospitals", getAllHospitals);

export default router;