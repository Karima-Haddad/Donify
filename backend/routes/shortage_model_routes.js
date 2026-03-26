import express from "express";
import { getPredictions } from "../controllers/shortage_model_controller.js";

const router = express.Router();

router.post("/predict", getPredictions);

export default router;