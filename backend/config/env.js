import dotenv from "dotenv";
dotenv.config(); 

export const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  AI_SERVICE_URL: process.env.AI_SERVICE_URL,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
};