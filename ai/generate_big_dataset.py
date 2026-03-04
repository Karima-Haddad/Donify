import pandas as pd
import numpy as np
import os
import uuid
from datetime import datetime, timedelta

N = 30000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(BASE_DIR, "data")
file_path = os.path.join(data_dir, "big_realistic_dataset.csv")

blood_types = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
rows = []

start_date = datetime(2020, 1, 1)

for i in range(N):
    date = start_date + timedelta(days=i)

    requested = np.random.randint(10, 60)
    donated = np.random.randint(5, 65)

    gap = requested - donated

    if gap > 15:
        shortage = 1
    elif gap > 5:
        shortage = np.random.choice([0,1], p=[0.3,0.7])
    elif gap > 0:
        shortage = np.random.choice([0,1], p=[0.6,0.4])
    else:
        shortage = np.random.choice([0,1], p=[0.9,0.1])

    rows.append([
        date.strftime("%Y-%m-%d"),
        str(uuid.uuid4()),
        np.random.choice(blood_types),
        requested,
        donated,
        gap,
        date.month,
        int(date.weekday() >= 5),
        int(date.month in [6, 7, 8]),
        int(date.month in [3, 4]),
        np.random.randint(20, 200),
        np.random.randint(10, 150),
        shortage
    ])

columns = [
    "date",
    "location_id",
    "blood_type",
    "total_requested_bags",
    "total_donated_bags",
    "gap_bags",
    "month",
    "is_weekend",
    "is_summer",
    "is_ramadan_like",
    "req_7d",
    "don_7d",
    "shortage_label"
]

df = pd.DataFrame(rows, columns=columns)
df.to_csv(file_path, index=False)

print("Dataset réaliste créé")
print(df["shortage_label"].value_counts())