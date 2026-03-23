
/**
 * Controller pour prédire les pénuries
 * Appelle le service IA et gère les réponses et erreurs
*/
import {
  getHospitalShortageData,
  buildShortagePayload,
  predictShortage
} from "../src/services/Shortage_service.js";

export async function getPredictions(req, res, next) {
  try {
    const { hospital_id } = req.body;

    if (!hospital_id) {
      return res.status(400).json({ error: "hospital_id is required" });
    }

    // 🔥 récupérer données DB
    const rows = await getHospitalShortageData(hospital_id);

    // 🔥 construire payload IA
    const payload = buildShortagePayload(rows);

    // 🔥 appel FastAPI
    const predictions = await predictShortage(payload);

    return res.json({
      hospital_id,
      predictions
    });

  } catch (err) {
    next(err);
  }
}