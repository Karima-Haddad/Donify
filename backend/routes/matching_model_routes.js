import express from "express";
import { validate } from "../middleware/validator.js";
import { matchingSchema } from "../src/validators/matching_schema.js";
import { getTopK, mlHealth, confirmDonation, getValidatedDonationsController} from "../controllers/matching_model_controller.js"

const router = express.Router();

// test ML health
router.get("/ml-health", mlHealth);

// matching top-k
router.post("/topk", validate(matchingSchema), getTopK);

// confirm donation
router.post("/validate-donation", confirmDonation);

// get validated donations for a request
router.get("/validated-donations/:requestId", getValidatedDonationsController);

export default router;