import express from "express";
import { validate } from "../middleware/validator.js";
import { matchingSchema } from "../src/validators/matching_schema.js";
import { getTopK, mlHealth } from "../controllers/matching_model_controller.js"

const router = express.Router();

// test ML health
router.get("/ml-health", mlHealth);

// matching top-k
router.post("/topk", validate(matchingSchema), getTopK);

export default router;