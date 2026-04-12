/**
 * Service IA
 * Appelle le microservice FastAPI pour prédire les pénuries
 */
import axios from "axios";
import { env } from "../../config/env.js"; 
import {
  getTodayRequests,
  getTodayDonations,
  getRequestsLast7Days,
  getDonationsLast7Days,
  getCurrentStock
} from "../../repositories/shortage_repository.js";

const AI_SERVICE_URL = env.AI_SERVICE_URL;
const INTERNAL_API_KEY = env.INTERNAL_API_KEY;

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

function getTemporalFlags(date = new Date()) {
  const month = date.getMonth() + 1;
  const weekday = date.getDay(); // 0=dimanche, 6=samedi

  return {
    month,
    is_weekend: weekday === 0 || weekday === 6 ? 1 : 0,
    is_summer: [6, 7, 8].includes(month) ? 1 : 0,
    is_ramadan_like: [3, 4].includes(month) ? 1 : 0,
  };
}

/**
 * rows doit contenir au plus une ligne par blood_type avec :
 * - blood_type
 * - total_requested_bags
 * - total_donated_bags
 * - current_stock_bags
 * - req_7d
 * - don_7d
 */
export function buildShortagePayload(rows) {
  const baseMap = new Map(
    rows.map((row) => [
      row.blood_type,
      {
        blood_type: row.blood_type,
        total_requested_bags: Math.round(Number(row.total_requested_bags ?? 0)),
        total_donated_bags: Math.round(Number(row.total_donated_bags ?? 0)),
        current_stock_bags: Math.round(Number(row.current_stock_bags ?? 0)),
        req_7d: Math.round(Number(row.req_7d ?? 0)),
        don_7d: Math.round(Number(row.don_7d ?? 0)),
      },
    ])
  );

  const { month, is_weekend, is_summer, is_ramadan_like } = getTemporalFlags();

  return BLOOD_TYPES.map((bloodType) => {
    const item = baseMap.get(bloodType) ?? {
      blood_type: bloodType,
      total_requested_bags: 0,
      total_donated_bags: 0,
      current_stock_bags: 0,
      req_7d: 0,
      don_7d: 0,
    };

    const gap_bags = item.total_requested_bags - item.total_donated_bags;
    const stock_coverage_days =
      item.total_requested_bags > 0
        ? Number((item.current_stock_bags / item.total_requested_bags).toFixed(2))
        : 0;

    return {
      blood_type: bloodType,
      total_requested_bags: item.total_requested_bags,
      total_donated_bags: item.total_donated_bags,
      gap_bags,
      current_stock_bags: item.current_stock_bags,
      stock_coverage_days,
      month,
      is_weekend,
      is_summer,
      is_ramadan_like,
      req_7d: item.req_7d,
      don_7d: item.don_7d,
    };
  });
}

export async function predictShortage(payload) {
  if (!AI_SERVICE_URL) {
    const err = new Error("AI_SERVICE_URL is not defined in .env");
    err.statusCode = 500;
    throw err;
  }

  if (!INTERNAL_API_KEY) {
    const err = new Error("INTERNAL_API_KEY is not defined in .env");
    err.statusCode = 500;
    throw err;
  }

  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/predict-shortage`,
      payload,
      {
        headers: {
          "x-api-key": INTERNAL_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
  console.error("Erreur IA complète =", error.response?.data || error.message);

  const detail = error.response?.data?.detail ?? error.response?.data ?? error.message ?? "AI service error";

  const message =
    typeof detail === "string"
      ? detail
      : JSON.stringify(detail, null, 2);

  const err = new Error(message);
  err.statusCode = error.response?.status || 500;
  throw err;
}
}


export async function getHospitalShortageData(hospitalId) {
  const [
    todayReq,
    todayDon,
    req7d,
    don7d,
    stock
  ] = await Promise.all([
    getTodayRequests(hospitalId),
    getTodayDonations(hospitalId),
    getRequestsLast7Days(hospitalId),
    getDonationsLast7Days(hospitalId),
    getCurrentStock(hospitalId)
  ]);

  // Convertir en map pour fusion facile
  const map = new Map();

  function merge(rows, key) {
    rows.forEach(r => {
      const bt = r.blood_type;
      if (!map.has(bt)) {
        map.set(bt, { blood_type: bt });
      }
      map.get(bt)[key] = Number(Object.values(r)[1]);
    });
  }

  merge(todayReq, "total_requested_bags");
  merge(todayDon, "total_donated_bags");
  merge(req7d, "req_7d");
  merge(don7d, "don_7d");

  stock.forEach(r => {
    const bt = r.blood_type;
    if (!map.has(bt)) {
      map.set(bt, { blood_type: bt });
    }
    map.get(bt)["current_stock_bags"] = Number(r.current_stock_bags);
  });

  return Array.from(map.values());
}