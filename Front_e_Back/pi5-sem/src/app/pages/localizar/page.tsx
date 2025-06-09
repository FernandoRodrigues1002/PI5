"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./localizar.module.css";

export default function Localizar() {
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInitializedRef = useRef(false);

  // Função para extrair o cep da URL
  function getCepFromUrl() {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("cep");
  }

  useEffect(() => {
    if (mapInitializedRef.current) return;
    mapInitializedRef.current = true;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Remove mapa anterior se já existir
      if ((mapRef.current as any)._leaflet_map) {
        const existingMap = (mapRef.current as any)._leaflet_map;
        existingMap.remove();
        delete (mapRef.current as any)._leaflet_map;
        mapRef.current.innerHTML = "";
      }

      // Corrige ícones do Leaflet no Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Função para inicializar o mapa com lat/lon
      const initMap = async (lat: number, lon: number) => {
        if (!mapRef.current) return;

        const redIcon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const blueIcon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const map = L.map(mapRef.current).setView([lat, lon], 14);
        (mapRef.current as any)._leaflet_map = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        // Marcador principal (vermelho)
        L.marker([lat, lon], { icon: redIcon })
          .addTo(map)
          .bindPopup("Você está aqui")
          .openPopup();

        setLoading(true);
        try {
          const response = await fetch(
            `/postos_proximos?lat=${lat}&lon=${lon}`
          );
          const postos = await response.json();

          if (!Array.isArray(postos) || postos.length === 0) {
            alert("Nenhum posto encontrado.");
            return;
          }

          postos.forEach((p: any) => {
            if (p.lat && p.lon) {
              const marker = L.marker([p.lat, p.lon], { icon: blueIcon }).addTo(map);
              marker.bindPopup(
                `<div class="popup-content ${styles.popupContentGlobal}">
                  <b>${p.nome}</b><br><br>
                  <button class="popup-content-btn" id="detalhes-${p.lat}-${p.lon}">Ver Detalhes</button>
                </div>`
              );
              marker.on("popupopen", () => {
                setTimeout(() => {
                  const btn = document.getElementById(
                    `detalhes-${p.lat}-${p.lon}`
                  );
                  if (btn) {
                    btn.onclick = () =>
                      (window as any).mostrarOverlay(p.nome, p.medicamentos);
                  }
                }, 0);
              });
            }
          });
        } catch (error) {
          console.error("Erro ao buscar postos:", error);
          alert("Erro ao buscar postos.");
        } finally {
          setLoading(false);
        }
      };

      // Função overlay
      (window as any).mostrarOverlay = (nome: string, medicamentos: any[]) => {
        let content = `<h3>${nome}</h3>`;
        if (medicamentos && medicamentos.length > 0) {
          content += "<ul>";
          medicamentos.forEach((m) => {
            content += `<li>${m.nome} <span class="quantidade">(${m.quantidade} un.)</span></li>`;
          });
          content += "</ul>";
        } else {
          content += "<p>Sem medicamentos disponíveis.</p>";
        }
        const overlayContent = document.getElementById("overlay-content");
        const overlay = document.getElementById("overlay");
        if (overlayContent && overlay) {
          overlayContent.innerHTML = content;
          overlay.style.opacity = "1";
          overlay.style.pointerEvents = "auto";
          overlay.style.transform = "translateY(0)";
        }
      };
      (window as any).fecharOverlay = () => {
        const overlay = document.getElementById("overlay");
        if (overlay) {
          overlay.style.opacity = "0";
          overlay.style.pointerEvents = "none";
          overlay.style.transform = "translateY(-20px)";
        }
      };

      // --- Fluxo principal ---
      const cep = getCepFromUrl();
      if (cep) {
        // Busca lat/lon pelo backend usando o CEP
        setLoading(true);
        fetch(`/geocode_cep?cep=${cep}`)
          .then(res => res.json())
          .then(data => {
            if (data.lat && data.lon) {
              initMap(Number(data.lat), Number(data.lon));
            } else {
              alert("CEP não encontrado!");
              setLoading(false);
            }
          })
          .catch(() => {
            alert("Erro ao buscar localização pelo CEP!");
            setLoading(false);
          });
      } else {
        // Usa geolocalização do navegador
        navigator.geolocation.getCurrentPosition(async (position) => {
          initMap(position.coords.latitude, position.coords.longitude);
        }, () => {
          alert("Não foi possível obter sua localização.");
        });
      }
    });
  }, []);

  return (
    <>
      <title>Mapa de Postos</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet/dist/leaflet.css"
      />
      <div className={styles.container}>
        <div id="map" ref={mapRef} className={styles.map}>
          {loading && (
            <div className={styles.loaderOverlay}>
              <div className={styles.loader}></div>
              <span>Carregando UBS próximas...</span>
            </div>
          )}
        </div>
      </div>
      <div id="overlay" className={styles.overlay}>
        <span id="overlay-content"></span>
        <button onClick={() => (window as any).fecharOverlay()}>Fechar</button>
      </div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </>
  );

}