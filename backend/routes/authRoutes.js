// // backend/src/routes/authRoutes.js
// import express from "express";
// import { loginUser } from "../controllers/authController.js";
// import {
//   registerDonor,
//   registerHospital,
//   loginUser,
//   forgotPassword,
//   resetPassword,
//   getAllUsers,
//   getAllDonors,
//   getAllHospitals,
// } from "../controllers/authController.js";


// const router = express.Router();

// // POST
// router.post("/register/donor", registerDonor);
// router.post("/register/hospital", registerHospital);
// router.post("/login", loginUser);

// // Routes pour mot de passe oublié
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);


// // GET (tests uniquement)
// router.get("/users", getAllUsers);
// router.get("/donors", getAllDonors);
// router.get("/hospitals", getAllHospitals);

// export default router;


import express from "express";
import {
  registerDonor,
  registerHospital,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getAllDonors,
  getAllHospitals,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/donor", registerDonor);
router.post("/register/hospital", registerHospital);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/users", getAllUsers);
router.get("/donors", getAllDonors);
router.get("/hospitals", getAllHospitals);

export default router;