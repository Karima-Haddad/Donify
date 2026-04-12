import { updateDonorProfilService } from "../src/services/donorService.js";

export const updateDonorProfilController = async (req, res, next) => {
  try {
    const donorId = req.params.id;
    const data = req.body;
    const updated = await updateDonorProfilService(donorId, data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
