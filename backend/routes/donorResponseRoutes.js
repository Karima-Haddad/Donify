import express from "express";
import { respondToRequestController } from "../controllers/donorResponseController.js";

const router = express.Router();

/*Un endpoint permettant de soumettre une réponse*/
router.post("/respond", respondToRequestController);

export default router;