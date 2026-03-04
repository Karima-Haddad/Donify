// auth.route.js
import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// Routes pour mot de passe oublié
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);


export default router;
