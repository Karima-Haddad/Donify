import dotenv from "dotenv";
dotenv.config();

import { findBloodRequestById } from "./repositories/bloodRequestRepository.js";

async function test() {
  try {
    const id = "f66e3ced-8647-4fce-90d5-7513084a022e";
    const result = await findBloodRequestById(id);
    console.log("Demande trouvée :", result);
  } catch (error) {
    console.error("Erreur :", error);
  }
}

test();