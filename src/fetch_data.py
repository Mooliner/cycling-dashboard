import requests
from auth import refresh_access_token


def get_activities():
    """
    Descarga todas las actividades de mi cuenta desde la API de Strava.

    Returns:
        list[dict]: lista de actividades en formato sucio.
    """
    access_token = refresh_access_token()["access_token"]

    URL = "https://www.strava.com/api/v3/athlete/activities"

    activitats = requests.get(URL, params= {"per_page":200}, headers={"Authorization": "Bearer " + access_token})

    return activitats.json()


if __name__ == "__main__":
    print(get_activities()[0])