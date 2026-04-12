import { updateDonorProfilRepository } from "../../repositories/donorRepository.js";

export const updateDonorProfilService = async (donorId, data) => {
  return await updateDonorProfilRepository(donorId, data);
};
