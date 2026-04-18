#!/usr/bin/env python3

"""
Ce script est le point d'entrée pour préparer les données et entraîner les modèles.
Il vérifie l'existence des datasets et des modèles, et les génère/entraîne si nécessaire.
"""
import sys
from pathlib import Path
import subprocess


def run_script(script_path: Path) -> None:
    print(f"➡️ Exécution de {script_path.name}...")
    subprocess.run([sys.executable, str(script_path)], check=True)


def main() -> None:
    root_dir = Path(__file__).resolve().parents[1]
    data_dir = root_dir / "data"
    models_dir = root_dir / "models"

    shortage_dataset = data_dir / "shortage_model_dataset.csv"
    matching_dataset = data_dir / "matching_training_dataset.csv"
    shortage_model = models_dir / "shortage_model.joblib"
    matching_model = models_dir / "xgboost.joblib"

    print("=== Vérification des datasets ===")

    if not shortage_dataset.exists():
        print("➡️ Génération dataset shortage...")
        run_script(root_dir / "services" / "generate_shortage_dataset.py")
    else:
        print("✅ Dataset shortage déjà existant")

    if not matching_dataset.exists():
        print("➡️ Génération dataset matching...")
        run_script(root_dir / "services" / "generate_matching_dataset.py")
    else:
        print("✅ Dataset matching déjà existant")

    print("=== Vérification des modèles ===")

    if not shortage_model.exists():
        print("➡️ Entraînement modèle shortage...")
        run_script(root_dir / "services" / "train_shortage_model.py")
    else:
        print("✅ Modèle shortage déjà existant")

    if not matching_model.exists():
        print("➡️ Entraînement modèle matching...")
        run_script(root_dir / "services" / "train_matching_model.py")
    else:
        print("✅ Modèle matching déjà existant")



if __name__ == "__main__":
    main()
