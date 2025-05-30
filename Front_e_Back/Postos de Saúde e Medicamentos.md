# API de Postos de Saúde e Medicamentos

Base URL: `http://<host>:<port>/`

## Endpoints

### 1. `GET /`

**Descrição:**  
Retorna a página HTML principal com o mapa dos postos.

**Resposta:**  
- `200 OK`  
  Conteúdo HTML da página inicial.

---

### 2. `GET /postos_proximos?lat=<latitude>&lon=<longitude>`

**Descrição:**  
Retorna uma lista de postos de saúde próximos à localização informada, incluindo medicamentos disponíveis em cada posto.

**Parâmetros de Query:**
- `lat` (float, obrigatório): Latitude do usuário.
- `lon` (float, obrigatório): Longitude do usuário.

**Resposta de Sucesso:**
- `200 OK`
```json
[
  {
    "nome": "Nome do Posto",
    "lat": -23.12345,
    "lon": -46.12345,
    "medicamentos": [
      {
        "nome": "Paracetamol",
        "tipo_medicamento": 20,
        "quantidade": 10
      },
      ...
    ]
  },
  ...
]
```

**Resposta de Erro:**
- `500 Internal Server Error`
```json
{
  "erro": "Mensagem de erro detalhada"
}
```

---

## Funções Internas

- **`buscar_postos_osm(lat, lon, raio_m=2000)`**  
  Busca postos de saúde próximos usando a API Overpass (OpenStreetMap).

- **`buscar_medicamentos()`**  
  Retorna uma lista aleatória de medicamentos do banco de dados MySQL.

---

## Observações

- O endpoint `/postos_proximos` utiliza a geolocalização para buscar hospitais e clínicas em um raio de 2km.
- Cada posto retorna uma lista de medicamentos simulada a partir do banco de dados.
- O endpoint raiz `/` serve uma página HTML com o mapa interativo.

---

**Arquivo principal:** main.py  
**Templates:** index.html  
**Estático:** style.css



