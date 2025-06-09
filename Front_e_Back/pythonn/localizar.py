from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import mysql.connector
import random

app = FastAPI()

# Habilita CORS para frontend acessar o backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajuste para ["http://localhost:3000"] se quiser restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def conectar_mysql():
    return mysql.connector.connect(
        host="centerbeam.proxy.rlwy.net",
        port=47834,
        user="root",
        password="LeDaSiyWdDlzDkhEhWDNwoDSOwuAudjO",
        database="railway"
    )

def buscar_medicamentos(premium=False):
    conn = conectar_mysql()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT nome, tipo_medicamento, quantidade FROM medicamentos")
    todos = cursor.fetchall()
    conn.close()

    vacinas = [m for m in todos if int(m['tipo_medicamento']) == 20]
    outros = [m for m in todos if int(m['tipo_medicamento']) != 20]

    if premium:
        todos_meds = vacinas + outros
        n_total = min(len(todos_meds), 15)
        n_sorteio = random.randint(0, n_total)
        selecionados = random.sample(todos_meds, n_sorteio) if n_sorteio else []
    else:
        n_vacinas = random.randint(0, len(vacinas)) if vacinas else 0
        selecionados = random.sample(vacinas, n_vacinas) if n_vacinas else []

    if not premium:
        print("DEBUG NÃO PREMIUM:", [(m['nome'], m['tipo_medicamento']) for m in selecionados])
    # Debug: veja o que está sendo retornado
    print(f"Premium? {premium} | Retornando: {[m['nome'] for m in selecionados]}")
    return selecionados

def buscar_postos_osm(lat, lon, raio_m=2000, premium=False):
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

        medicamentos = buscar_medicamentos(premium=premium)

        postos.append({
            "nome": nome,
            "lat": lat_post,
            "lon": lon_post,
            "medicamentos": medicamentos
        })

    return postos

@app.get("/postos_proximos")
async def postos(lat: float, lon: float, request: Request):
    try:
        email = request.headers.get("x-user-email")
        premium = False
        if email:
            conn = conectar_mysql()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT premium FROM usuarios WHERE email = %s", (email,))
            user = cursor.fetchone()
            conn.close()
            # Aqui está o segredo: só é premium se o campo for 1 ou True
            if user and (user.get("premium") == 1 or user.get("premium") is True):
                premium = True
        # Se não tem email ou não é premium, premium continua False
        print(f"DEBUG: email={email} | premium={premium}")
        resultados = buscar_postos_osm(lat, lon, premium=premium)
        return JSONResponse(content=resultados)
    except Exception as e:
        print("Erro:", e)
        return JSONResponse(content={"erro": str(e)}, status_code=500)

@app.get("/geocode_cep")
def geocode_cep(cep: str):
    # 1. Busca endereço pelo CEP (ViaCEP)
    viacep = requests.get(f"https://viacep.com.br/ws/{cep}/json/").json()
    if "erro" in viacep:
        return {"erro": "CEP não encontrado"}
    logradouro = viacep.get("logradouro", "")

    # 2. Usa Nominatim para geocodificar o endereço com User-Agent
    endereco = f"{logradouro}"
    response = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": endereco, "format": "json"},
        headers={"User-Agent": "MeuApp/1.0 (meu.email@exemplo.com)"}
    )
    try:
        nominatim = response.json()
    except Exception:
        return {"erro": "Resposta inválida do servidor de geocodificação"}

    if not nominatim:
        return {"erro": "Não foi possível geocodificar o CEP"}

    lat = nominatim[0]["lat"]
    lon = nominatim[0]["lon"]
    return {"lat": lat, "lon": lon}