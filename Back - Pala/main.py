from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import requests
import mysql.connector
import random


app = FastAPI()
templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")



def conectar_mysql():
    return mysql.connector.connect(
        host="yamabiko.proxy.rlwy.net",
        port=12819,
        user="root",
        password="NYnoojOFphBrJpxBLjjcIpFlKeYXYHKJ",
        database="railway"
    )

def buscar_medicamentos():
    conn = conectar_mysql()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT nome, tipo_medicamento, quantidade FROM medicamentos")
    todos = cursor.fetchall()

    tipo_20 = [m for m in todos if m['tipo_medicamento'] == 20]
    outros = [m for m in todos if m['tipo_medicamento'] != 20]

    if not tipo_20:
        tipo_20_escolhido = []
    else:
        tipo_20_escolhido = [random.choice(tipo_20)]

    n_outros = random.randint(0, 9)
    outros_escolhidos = random.sample(outros, min(n_outros, len(outros)))

    selecionados = tipo_20_escolhido + outros_escolhidos
    random.shuffle(selecionados)

    conn.close()
    return selecionados



# Raio grande o suficiente para buscar vários estabelecimentos (~2 km)
def buscar_postos_osm(lat, lon, raio_m=2000):
    overpass_url = "http://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:{raio_m},{lat},{lon});
      way["amenity"="hospital"](around:{raio_m},{lat},{lon});
      relation["amenity"="hospital"](around:{raio_m},{lat},{lon});
      
      node["amenity"="clinic"](around:{raio_m},{lat},{lon});
      way["amenity"="clinic"](around:{raio_m},{lat},{lon});
      relation["amenity"="clinic"](around:{raio_m},{lat},{lon});

      node["healthcare"="hospital"](around:{raio_m},{lat},{lon});
      way["healthcare"="hospital"](around:{raio_m},{lat},{lon});
      relation["healthcare"="hospital"](around:{raio_m},{lat},{lon});

      node["healthcare"="clinic"](around:{raio_m},{lat},{lon});
      way["healthcare"="clinic"](around:{raio_m},{lat},{lon});
      relation["healthcare"="clinic"](around:{raio_m},{lat},{lon});
    );
    out center;
    """

    response = requests.post(overpass_url, data={"data": query})
    dados = response.json()

    postos = []

    for el in dados.get("elements", []):
        nome = el["tags"].get("name", "UBS sem nome")

        if "lat" in el and "lon" in el:
            lat_post = el["lat"]
            lon_post = el["lon"]
        elif "center" in el:
            lat_post = el["center"]["lat"]
            lon_post = el["center"]["lon"]
        else:
            continue

        medicamentos = buscar_medicamentos()  

        postos.append({
            "nome": nome,
            "lat": lat_post,
            "lon": lon_post,
            "medicamentos": medicamentos
        })

    return postos




@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/postos_proximos")
async def postos(lat: float, lon: float):
    try:
        resultados = buscar_postos_osm(lat, lon)
        print(f"Total encontrados: {len(resultados)}")
        for p in resultados:
            print(p)
        return JSONResponse(content=resultados)
    except Exception as e:
        print("Erro:", e)
        return JSONResponse(content={"erro": str(e)}, status_code=500)




