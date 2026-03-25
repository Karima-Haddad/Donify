// src/data/tunisiaLocations.ts

// ── Types ──────────────────────────────────────────────────────────────────
interface CityData {
  latitude: number;
  longitude: number;
}

interface GovernorateData {
  latitude: number;
  longitude: number;
  cities: Record<string, CityData>;
}

type TunisiaLocationsMap = Record<string, GovernorateData>;

// ── Données ────────────────────────────────────────────────────────────────
export const tunisiaLocations: TunisiaLocationsMap = {
  "Tunis": {
    latitude: 36.8190, longitude: 10.1658,
    cities: {
      "Tunis": { latitude: 36.8190, longitude: 10.1658 },
      "La Marsa": { latitude: 36.8781, longitude: 10.3247 },
      "Carthage": { latitude: 36.8528, longitude: 10.3233 },
      "Le Bardo": { latitude: 36.8094, longitude: 10.1408 },
      "Ezzouhour": { latitude: 36.8350, longitude: 10.1750 },
      "Ettadhamen": { latitude: 36.8433, longitude: 10.1294 },
    }
  },
  "Ariana": {
    latitude: 36.8625, longitude: 10.1956,
    cities: {
      "Ariana": { latitude: 36.8625, longitude: 10.1956 },
      "Raoued": { latitude: 36.8978, longitude: 10.2317 },
      "Kalaat el-Andalous": { latitude: 37.0167, longitude: 10.0833 },
      "Sidi Thabet": { latitude: 36.9000, longitude: 10.0333 },
      "La Soukra": { latitude: 36.8833, longitude: 10.2167 },
    }
  },
  "Ben Arous": {
    latitude: 36.7531, longitude: 10.2281,
    cities: {
      "Ben Arous": { latitude: 36.7531, longitude: 10.2281 },
      "Hammam Lif": { latitude: 36.7333, longitude: 10.3333 },
      "Hammam Chott": { latitude: 36.7167, longitude: 10.3500 },
      "Bou Mhel el-Bassatine": { latitude: 36.7500, longitude: 10.2667 },
      "Ezzahra": { latitude: 36.7500, longitude: 10.2833 },
      "Mohamedia": { latitude: 36.7833, longitude: 10.2000 },
      "Mégrine": { latitude: 36.7667, longitude: 10.2167 },
    }
  },
  "Manouba": {
    latitude: 36.8078, longitude: 10.0972,
    cities: {
      "Manouba": { latitude: 36.8078, longitude: 10.0972 },
      "Den Den": { latitude: 36.8167, longitude: 10.1167 },
      "Douar Hicher": { latitude: 36.8167, longitude: 10.0833 },
      "Oued Ellil": { latitude: 36.8333, longitude: 10.0500 },
      "Tébourba": { latitude: 36.8333, longitude: 9.8333 },
      "El Battan": { latitude: 36.8833, longitude: 9.9833 },
    }
  },
  "Nabeul": {
    latitude: 36.4561, longitude: 10.7376,
    cities: {
      "Nabeul": { latitude: 36.4561, longitude: 10.7376 },
      "Hammamet": { latitude: 36.4000, longitude: 10.6167 },
      "Kelibia": { latitude: 36.8500, longitude: 11.1000 },
      "Dar Chaabane": { latitude: 36.6500, longitude: 10.7833 },
      "Beni Khiar": { latitude: 36.5000, longitude: 10.7667 },
      "Korba": { latitude: 36.5667, longitude: 10.8667 },
      "Menzel Temime": { latitude: 36.7833, longitude: 10.9833 },
    }
  },
  "Zaghouan": {
    latitude: 36.4028, longitude: 10.1428,
    cities: {
      "Zaghouan": { latitude: 36.4028, longitude: 10.1428 },
      "Zriba": { latitude: 36.3667, longitude: 10.2500 },
      "El Fahs": { latitude: 36.3833, longitude: 9.9000 },
      "Nadhour": { latitude: 36.3667, longitude: 10.0833 },
    }
  },
  "Bizerte": {
    latitude: 37.2744, longitude: 9.8739,
    cities: {
      "Bizerte": { latitude: 37.2744, longitude: 9.8739 },
      "Menzel Bourguiba": { latitude: 37.1500, longitude: 9.7833 },
      "Mateur": { latitude: 37.0333, longitude: 9.6667 },
      "Ras Jebel": { latitude: 37.2167, longitude: 10.1167 },
      "Sejnane": { latitude: 37.0583, longitude: 9.2361 },
      "Tinja": { latitude: 37.1833, longitude: 9.7167 },
    }
  },
  "Béja": {
    latitude: 36.7256, longitude: 9.1817,
    cities: {
      "Béja": { latitude: 36.7256, longitude: 9.1817 },
      "Medjez el-Bab": { latitude: 36.6500, longitude: 9.6167 },
      "Testour": { latitude: 36.5500, longitude: 9.4500 },
      "Nefza": { latitude: 37.0167, longitude: 9.0333 },
      "Thibar": { latitude: 36.7333, longitude: 9.3667 },
    }
  },
  "Jendouba": {
    latitude: 36.5011, longitude: 8.7803,
    cities: {
      "Jendouba": { latitude: 36.5011, longitude: 8.7803 },
      "Tabarka": { latitude: 36.9544, longitude: 8.7578 },
      "Aïn Draham": { latitude: 36.7833, longitude: 8.6833 },
      "Ghardimaou": { latitude: 36.4500, longitude: 8.4333 },
      "Bou Salem": { latitude: 36.6167, longitude: 8.9667 },
    }
  },
  "Kef": {
    latitude: 36.1826, longitude: 8.7147,
    cities: {
      "Kef": { latitude: 36.1826, longitude: 8.7147 },
      "Dahmani": { latitude: 35.9500, longitude: 8.8333 },
      "Tajerouine": { latitude: 35.8833, longitude: 8.5500 },
      "Sakiet Sidi Youssef": { latitude: 36.2333, longitude: 8.3500 },
    }
  },
  "Siliana": {
    latitude: 36.0850, longitude: 9.3708,
    cities: {
      "Siliana": { latitude: 36.0850, longitude: 9.3708 },
      "Makthar": { latitude: 35.8556, longitude: 9.2028 },
      "El Krib": { latitude: 36.2833, longitude: 9.4833 },
      "Bou Arada": { latitude: 36.3500, longitude: 9.6167 },
      "Gaâfour": { latitude: 36.3167, longitude: 9.3167 },
    }
  },
  "Sousse": {
    latitude: 35.8333, longitude: 10.6333,
    cities: {
      "Sousse": { latitude: 35.8333, longitude: 10.6333 },
      "Msaken": { latitude: 35.7333, longitude: 10.5833 },
      "Kalaa Kebira": { latitude: 35.8667, longitude: 10.5500 },
      "Akouda": { latitude: 35.8667, longitude: 10.5667 },
      "Hammam Sousse": { latitude: 35.8500, longitude: 10.5833 },
      "Enfidha": { latitude: 36.1333, longitude: 10.3833 },
    }
  },
  "Monastir": {
    latitude: 35.7833, longitude: 10.8333,
    cities: {
      "Monastir": { latitude: 35.7833, longitude: 10.8333 },
      "Moknine": { latitude: 35.6333, longitude: 10.9000 },
      "Ksar Hellal": { latitude: 35.6500, longitude: 10.8833 },
      "Jemmal": { latitude: 35.6167, longitude: 10.7667 },
      "Téboulba": { latitude: 35.6667, longitude: 10.9333 },
      "Sahline": { latitude: 35.7667, longitude: 10.7500 },
    }
  },
  "Mahdia": {
    latitude: 35.5047, longitude: 11.0622,
    cities: {
      "Mahdia": { latitude: 35.5047, longitude: 11.0622 },
      "Ksour Essef": { latitude: 35.4167, longitude: 11.0000 },
      "El Jem": { latitude: 35.2972, longitude: 10.7139 },
      "Chebba": { latitude: 35.2333, longitude: 11.1167 },
      "Bou Merdes": { latitude: 35.6333, longitude: 10.8833 },
    }
  },
  "Sfax": {
    latitude: 34.7406, longitude: 10.7603,
    cities: {
      "Sfax": { latitude: 34.7406, longitude: 10.7603 },
      "Sakiet Ezzit": { latitude: 34.8000, longitude: 10.7500 },
      "Sakiet Eddaïer": { latitude: 34.7833, longitude: 10.7167 },
      "El Ain": { latitude: 34.8167, longitude: 10.7000 },
      "Agareb": { latitude: 34.7333, longitude: 10.5500 },
      "Jebeniana": { latitude: 35.0167, longitude: 10.9000 },
      "Mahres": { latitude: 34.5333, longitude: 10.5000 },
    }
  },
  "Kairouan": {
    latitude: 35.6781, longitude: 10.0964,
    cities: {
      "Kairouan": { latitude: 35.6781, longitude: 10.0964 },
      "Sbikha": { latitude: 35.9167, longitude: 9.9833 },
      "El Alaa": { latitude: 35.5500, longitude: 9.5333 },
      "Haffouz": { latitude: 35.6333, longitude: 9.6833 },
      "Nasrallah": { latitude: 35.6667, longitude: 9.9667 },
    }
  },
  "Kasserine": {
    latitude: 35.1722, longitude: 8.8306,
    cities: {
      "Kasserine": { latitude: 35.1722, longitude: 8.8306 },
      "Sbeitla": { latitude: 35.2333, longitude: 9.1167 },
      "Thala": { latitude: 35.5667, longitude: 8.6667 },
      "Feriana": { latitude: 34.9500, longitude: 8.5667 },
      "Foussana": { latitude: 35.2667, longitude: 8.7833 },
    }
  },
  "Sidi Bouzid": {
    latitude: 35.0381, longitude: 9.4858,
    cities: {
      "Sidi Bouzid": { latitude: 35.0381, longitude: 9.4858 },
      "Meknassy": { latitude: 34.9833, longitude: 9.9667 },
      "Regueb": { latitude: 34.9000, longitude: 9.6833 },
      "Jilma": { latitude: 35.2833, longitude: 9.4833 },
      "Bir El Hafey": { latitude: 34.7000, longitude: 9.4833 },
    }
  },
  "Gabès": {
    latitude: 33.8833, longitude: 10.1000,
    cities: {
      "Gabès": { latitude: 33.8833, longitude: 10.1000 },
      "El Hamma": { latitude: 33.8833, longitude: 9.7833 },
      "Mareth": { latitude: 33.6333, longitude: 10.0833 },
      "Matmata": { latitude: 33.5500, longitude: 9.9667 },
      "Ghannouch": { latitude: 33.9333, longitude: 10.0667 },
    }
  },
  "Medenine": {
    latitude: 33.3547, longitude: 10.5053,
    cities: {
      "Medenine": { latitude: 33.3547, longitude: 10.5053 },
      "Zarzis": { latitude: 33.5000, longitude: 11.1167 },
      "Houmt Souk (Djerba)": { latitude: 33.8667, longitude: 10.8500 },
      "Ben Gardane": { latitude: 33.1333, longitude: 11.2167 },
      "Midoun": { latitude: 33.8000, longitude: 10.9833 },
      "Beni Khedache": { latitude: 33.0500, longitude: 10.0833 },
    }
  },
  "Tataouine": {
    latitude: 32.9211, longitude: 10.4511,
    cities: {
      "Tataouine": { latitude: 32.9211, longitude: 10.4511 },
      "Ghomrassen": { latitude: 33.0667, longitude: 10.4500 },
      "Remada": { latitude: 32.3167, longitude: 10.4000 },
      "Bir Lahmar": { latitude: 32.7333, longitude: 10.0833 },
    }
  },
  "Gafsa": {
    latitude: 34.4250, longitude: 8.7842,
    cities: {
      "Gafsa": { latitude: 34.4250, longitude: 8.7842 },
      "Metlaoui": { latitude: 34.3333, longitude: 8.4000 },
      "Moulares": { latitude: 34.4833, longitude: 8.2333 },
      "El Ksar": { latitude: 34.4167, longitude: 8.8167 },
      "Redeyef": { latitude: 34.3833, longitude: 8.1500 },
    }
  },
  "Tozeur": {
    latitude: 33.9197, longitude: 8.1336,
    cities: {
      "Tozeur": { latitude: 33.9197, longitude: 8.1336 },
      "Nefta": { latitude: 33.8667, longitude: 7.8833 },
      "Degache": { latitude: 33.9667, longitude: 8.2000 },
      "Hazoua": { latitude: 33.8833, longitude: 7.9833 },
    }
  },
  "Kebili": {
    latitude: 33.7044, longitude: 8.9644,
    cities: {
      "Kebili": { latitude: 33.7044, longitude: 8.9644 },
      "Douz": { latitude: 33.4500, longitude: 9.0167 },
      "Souk Lahad": { latitude: 33.5333, longitude: 9.1667 },
      "Faouar": { latitude: 33.1667, longitude: 9.0167 },
    }
  }
};

// ── Fonctions utilitaires typées ───────────────────────────────────────────

// Liste des 24 gouvernorats
export const governoratesList: string[] = Object.keys(tunisiaLocations);

// Retourne les villes d'un gouvernorat
export const getCitiesByGovernorate = (governorate: string): string[] => {
  if (!governorate || !tunisiaLocations[governorate]) return [];
  return Object.keys(tunisiaLocations[governorate].cities);
};

// Retourne latitude et longitude d'une ville
export const getCoordinates = (
  governorate: string,
  city: string
): { latitude: number | null; longitude: number | null } => {
  if (!governorate || !city) return { latitude: null, longitude: null };
  const gov = tunisiaLocations[governorate];
  if (!gov) return { latitude: null, longitude: null };
  const cityData = gov.cities[city];
  if (!cityData) return { latitude: gov.latitude, longitude: gov.longitude };
  return { latitude: cityData.latitude, longitude: cityData.longitude };
};