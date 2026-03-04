import api from "./api";

// ---------------- LOGIN ----------------
export const loginUser = (data: { email: string; password: string }) => {
  return api.post("/auth/login", data); // retourne { token, role }
};

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = (email: string) => {
  return api.post("/auth/forgot-password", { email });
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = (token: string, password: string) => {
  return api.post("/auth/reset-password", { token, password });
};

// ---------------- REGISTER ----------------
export const registerUser = (data: { email: string; password: string; role?: string }) => {
  return api.post("/auth/register", data);
};
