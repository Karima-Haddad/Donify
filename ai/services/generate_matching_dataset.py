'''
Ce script génère un dataset synthétique pour entraîner un modèle de matching de donneurs de sang.
Il simule des caractéristiques réalistes (âge, distance, fiabilité, etc.) et une logique d'acceptation basée sur une fonction logistique.
'''

from pathlib import Path

import numpy as np
import pandas as pd

# ---------- REPRO ----------
SEED = 42
rng = np.random.default_rng(SEED)

# ---------- PARAMETERS ----------
N_ROWS = 5_000_000          # change to 10_000_000 if needed
CHUNK_SIZE = 500_000        # adjust based on RAM (200k–1M is usually OK)
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = DATA_DIR / "matching_training_dataset.csv"

# ---------- Distributions / Controls ----------
P_GENDER = [0.55, 0.45]  # male, female

BLOOD_LABELS = ["O+","A+","B+","AB+","O-","A-","B-","AB-"]
BLOOD_P =      [0.42,0.30,0.12,0.05,0.06,0.03,0.015,0.005]

AGE_MEAN, AGE_STD = 35, 10
AGE_MIN, AGE_MAX = 18, 60

# distance ~ Gamma(shape=2, scale=15) => mean=30 km, long tail
DIST_SHAPE, DIST_SCALE = 2.0, 15.0
DIST_MIN, DIST_MAX = 0.5, 200.0

# days since last donation mixture
P_NEVER = 0.10
P_RECENT = 0.75       # among those who donated, majority 90–365
RECENT_MIN, RECENT_MAX = 90, 365
OLDER_MIN, OLDER_MAX = 365, 1500
NEVER_SENTINEL = 9999

# fatigue ~ N(0.3, 0.2) clipped to [0,1]
FATIGUE_MEAN, FATIGUE_STD = 0.3, 0.2

# ---------- Acceptance Logic Coeffs ----------
COEF_RELIABILITY = 1.6
COEF_DISTANCE = -0.035
COEF_FATIGUE = -1.5
COEF_NEVER = -1.2
COEF_AGE_FACTOR = 0.4  # align with your report

def sigmoid_stable(z: np.ndarray) -> np.ndarray:
    # prevent overflow for very large |z|
    z = np.clip(z, -20, 20)
    return 1.0 / (1.0 + np.exp(-z))

def generate_chunk(chunk_n: int) -> pd.DataFrame:
    n = chunk_n

    # Gender
    gender = rng.choice(["male", "female"], size=n, p=P_GENDER)

    # Blood type
    donor_blood_type = rng.choice(BLOOD_LABELS, size=n, p=BLOOD_P)

    # Age
    age = rng.normal(loc=AGE_MEAN, scale=AGE_STD, size=n)
    age = np.clip(age, AGE_MIN, AGE_MAX).astype(np.int16)

    # Distance
    distance_km = rng.gamma(shape=DIST_SHAPE, scale=DIST_SCALE, size=n)
    distance_km = np.clip(distance_km, DIST_MIN, DIST_MAX).astype(np.float32)

    # Days since last donation (realistic mixture)
    never_mask = rng.random(n) < P_NEVER
    donated_mask = ~never_mask

    days_since_last = np.empty(n, dtype=np.int32)

    # among donated: recent vs older
    recent_mask = donated_mask & (rng.random(n) < P_RECENT)
    older_mask = donated_mask & ~recent_mask

    days_since_last[recent_mask] = rng.integers(RECENT_MIN, RECENT_MAX, size=recent_mask.sum(), endpoint=False)
    days_since_last[older_mask]  = rng.integers(OLDER_MIN, OLDER_MAX, size=older_mask.sum(), endpoint=False)
    days_since_last[never_mask]  = NEVER_SENTINEL

    never_donated = never_mask.astype(np.int8)  # 0/1

    # Reliability (0..1)
    donor_reliability = rng.beta(2, 5, size=n).astype(np.float32)

    # Fatigue (0..1)
    fatigue_score = rng.normal(FATIGUE_MEAN, FATIGUE_STD, size=n)
    fatigue_score = np.clip(fatigue_score, 0, 1).astype(np.float32)

    # Notification timing
    notified_hour = rng.integers(0, 24, size=n, dtype=np.int8)
    notified_weekday = rng.integers(0, 7, size=n, dtype=np.int8)

    # Age factor: stable ages (25–45) => +1 else -0.2
    age_factor = np.where((age >= 25) & (age <= 45), 1.0, -0.2).astype(np.float32)

    # z score
    z = (
        COEF_RELIABILITY * donor_reliability
        + COEF_DISTANCE * distance_km
        + COEF_FATIGUE * fatigue_score
        + COEF_NEVER * never_donated
        + COEF_AGE_FACTOR * age_factor
    ).astype(np.float32)

    # probability + Bernoulli -> accepted_label
    p_accept = sigmoid_stable(z).astype(np.float32)
    accepted_label = rng.binomial(1, p_accept).astype(np.int8)

    # Build chunk dataframe
    df = pd.DataFrame({
        "gender": gender,
        "donor_blood_type": donor_blood_type,
        "age": age,
        "distance_km": distance_km,
        "days_since_last_donation": days_since_last,
        "never_donated": never_donated,
        "donor_reliability": donor_reliability,
        "fatigue_score": fatigue_score,
        "notified_hour": notified_hour,
        "notified_weekday": notified_weekday,
        "accepted_label": accepted_label
    })

    return df

# ---------- WRITE DATASET IN CHUNKS (RAM SAFE) ----------
n_written = 0
first = True
accept_sum = 0
rows_sum = 0

while n_written < N_ROWS:
    n = min(CHUNK_SIZE, N_ROWS - n_written)
    df_chunk = generate_chunk(n)

    # Track acceptance rate without loading full dataset
    accept_sum += df_chunk["accepted_label"].sum()
    rows_sum += len(df_chunk)

    df_chunk.to_csv(
        OUTPUT_FILE,
        index=False,
        mode="w" if first else "a",
        header=first
    )

    n_written += n
    first = False

    print(f"Written: {n_written:,}/{N_ROWS:,} | current acceptance rate: {accept_sum/rows_sum:.4f}")

print("\nDataset generated successfully.")
print("Output:", OUTPUT_FILE)
print("Rows:", rows_sum)
print("Final acceptance rate:", accept_sum / rows_sum)
