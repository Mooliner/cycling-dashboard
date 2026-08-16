import requests
import os
from dotenv import load_dotenv

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
refresh_token = os.getenv("REFRESH_TOKEN")


def get_acces_token(auth_code):
    """
    Intercambia un código de autorización por un access_token y el refresh_token iniciales.

    Solo se ejecuta la primera vez, donde se conecta a l'aplicación.

    Args:
    auth_code (str): código de autorización obtenida por la URL de Strava.

    Returns:
    dict: respuesta de Strava con access_token, refresh_token, expires_at...
    """
    resposta = requests.post("https://www.strava.com/oauth/token", data={"client_id":client_id, "client_secret":client_secret, "code":auth_code, "grant_type":"authorization_code"})

    return resposta.json()


def refresh_access_token():
    """
    Obtiene un access_token válido que hace servir el refresh_token guardado en él .env.

    Hace sería cada vez que necesita un token para llamar l'API.

    Returns:
    dict: respuesta de Strava con un access_token nuevo.
    """
    resposta = requests.post("https://www.strava.com/oauth/token", data={"client_id":client_id, "client_secret":client_secret, "refresh_token": refresh_token, "grant_type":"refresh_token"})

    return resposta.json()


if __name__ == "__main__":

    print(refresh_access_token())