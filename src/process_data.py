import pandas as pd
from fetch_data import get_activities


#Agafem les dades que ens interesnat i les guardem a df_net, on tambe canviem les dades a les metriques que natros volem
activitats = get_activities()

df = pd.DataFrame(activitats)

df_net = df[["name", "distance", "moving_time", "elapsed_time", "total_elevation_gain", "start_date_local", "average_speed", "max_speed", "average_cadence", "average_watts", "max_watts", "weighted_average_watts", "average_heartrate", "max_heartrate"]]

df_net["distance"] = df_net["distance"]/1000
df_net["moving_time"] = df_net["moving_time"]/3600
df_net["elapsed_time"] = df_net["elapsed_time"]/3600
df_net["average_speed"] = df_net["average_speed"] * 3.6
df_net["max_speed"] = df_net["max_speed"] * 3.6

df_net["start_date_local"] = pd.to_datetime(df_net["start_date_local"])


if __name__ == "__main__":
    #print(df_net.dtypes)
    # Fem aixo, per poder guardar les activitats de strava dins d'un fitxer i no a la memoria
    # orient, per poder organitzar les dades dins de JSON, amb records fem que cada activitat sgui un objecte
    # el date_format, lo donem el format de date que volem
    df_net.to_json("data/processed/activities.json", orient="records", date_format="iso")