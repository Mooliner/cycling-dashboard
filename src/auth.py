import requests
import os
from dotenv import load_dotenv

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
refresh_token = os.getenv("REFRESH_TOKEN")

#Funcio per poder aconseguir el token d'acces, fem un post.
#Nomes sha d'executar el primer cop, despres ja no fa falta.
def get_acces_token(auth_code):
    #data es un diccionari, per aixo necessita el "clau1":valor, per a cada una de les que te.
    resposta = requests.post("https://www.strava.com/oauth/token", data={"client_id":client_id, "client_secret":client_secret, "code":auth_code, "grant_type":"authorization_code"})

    return resposta.json()

#Funcio per poder refresencar el nostre auth_code, es necessri, perq strava el canvia cada poc temps
def refresh_access_token():

    resposta = requests.post("https://www.strava.com/oauth/token", data={"client_id":client_id, "client_secret":client_secret, "refresh_token": refresh_token, "grant_type":"refresh_token"})

    return resposta.json()

if __name__ == "__main__":

    print(refresh_access_token())