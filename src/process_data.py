import pandas as pd
from fetch_data import get_activities

"""
    Pipeline de transformación de datos, coge las actividades en sucio de Strava, selecciona los campos relevantes, convierte las unidades y normaliza los datos.
    El resultado se guarda como JSON, para después verlo en el dashboard.
"""

activitats = get_activities()

df = pd.DataFrame(activitats)

df_net = df[["name", "distance", "moving_time", "elapsed_time", "total_elevation_gain", "start_date_local", "average_speed", "max_speed", "average_cadence", "average_watts", "max_watts", "weighted_average_watts", "average_heartrate", "max_heartrate"]].copy()

df_net["distance"] = df_net["distance"]/1000
df_net["moving_time"] = df_net["moving_time"]/3600
df_net["elapsed_time"] = df_net["elapsed_time"]/3600
df_net["average_speed"] = df_net["average_speed"] * 3.6
df_net["max_speed"] = df_net["max_speed"] * 3.6

df_net["start_date_local"] = pd.to_datetime(df_net["start_date_local"])


if __name__ == "__main__":
# orient="records": las actividades se convierte en un objeto independiente.
# date_format="iso": los datos se guardan en el formato estándar de JavaScript.
    df_net.to_json("data/processed/activities.json", orient="records", date_format="iso")