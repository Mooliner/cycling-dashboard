import subprocess
import shutil

subprocess.run(["python3", "src/process_data.py"])

shutil.copy("data/processed/activities.json", "dashboard/public/activities.json")