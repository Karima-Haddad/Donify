
/**
 * Controller pour prédire les pénuries
 * Appelle le service IA et gère les réponses et erreurs
*/
import {
  getHospitalShortageData,
  buildShortagePayload,
  predictShortage
} from "../src/services/Shortage_service.js";

// export async function getPredictions(req, res, next) {
//   try {
//     const { hospital_id } = req.body;

//     if (!hospital_id) {
//       return res.status(400).json({ error: "hospital_id is required" });
//     }

//     // 🔥 récupérer données DB
//     const rows = await getHospitalShortageData(hospital_id);

//     // 🔥 construire payload IA
//     const payload = buildShortagePayload(rows);

//     // 🔥 appel FastAPI
//     const predictions = await predictShortage(payload);

//     return res.json({
//       hospital_id,
//       predictions
//     });

//   } catch (err) {
//     next(err);
//   }
// }


export async function getPredictions(req, res, next) {
  try {
    const { hospital_id } = req.body;

    console.log("req.body =", req.body);
    console.log("hospital_id =", hospital_id);

    if (!hospital_id) {
      return res.status(400).json({ error: "hospital_id is required" });
    }

    const rows = await getHospitalShortageData(hospital_id);
    console.log("rows =", rows);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        error: "Aucune donnée trouvée pour cet hôpital",
      });
    }

    const payload = buildShortagePayload(rows);
    console.log("payload =", JSON.stringify(payload, null, 2));

    const predictions = await predictShortage(payload);

    return res.json({
      hospital_id,
      predictions,
    });
  } catch (err) {
    console.error("Controller shortage error =", err);
    next(err);
  }
}