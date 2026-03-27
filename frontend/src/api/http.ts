/**
 * ce module configure une instance d'axios pour les requêtes HTTP vers l'API backend.
 */
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});


// add a request interceptor to include the token in the headers 


/**
 * Configure une instance Axios centralisée pour communiquer avec l’API backend.
 * Ajoute automatiquement le token d’authentification et gère les erreurs globales.
 */

// import axios from "axios";

// export const http = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ================================
// // Intercepteur de requête (Request)
// // ================================
// http.interceptors.request.use(
//   (config) => {
//     // Récupérer le token depuis le localStorage
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ================================
// // Intercepteur de réponse (Response)
// // ================================
// http.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Gestion globale des erreurs
//     if (error.response) {
//       const status = error.response.status;

//       // Exemple : token expiré
//       if (status === 401) {
//         console.warn("Utilisateur non autorisé - redirection login");

//         // Option simple
//         localStorage.removeItem("token");
//         window.location.href = "/";
//       }
//     }

//     return Promise.reject(error);
//   }
// );