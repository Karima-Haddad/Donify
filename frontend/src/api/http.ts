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