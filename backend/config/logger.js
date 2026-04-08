/*
  * Ce fichier configure le logger Pino pour l'application. 
  Il utilise un niveau "debug" 
  avec une sortie formatée et colorisée pour 
  faciliter la lecture des logs.
*/
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino(
  isProduction
    ? { level: "info" }
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
);