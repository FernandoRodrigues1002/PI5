"use client";

import { useEffect, useRef } from "react";
import Head from "next/head";
import styles from "./localizar.module.css";

export default function Localizar() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("leaflet").then(L => {
      if (!mapRef.current) return;

      // Remove mapa anterior se já existir
      if (mapRef.current && mapRef.current._leaflet_id) {
        // @ts-ignore
        mapRef.current._leaflet_id = null;
        mapRef.current.innerHTML = "";
      }

      // Corrige ícones do Leaflet no Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Só cria o mapa se ainda não existe
        if (!mapRef.current) return;
        // @ts-ignore
        if (mapRef.current._leaflet_map) return;

        // @ts-ignore
        const map = L.map(mapRef.current).setView([lat, lon], 14);
        // @ts-ignore
        mapRef.current._leaflet_map = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        L.marker([lat, lon]).addTo(map).bindPopup("Você está aqui").openPopup();

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

        try {
          // Altere a URL se necessário para acessar o backend Python
          const response = await fetch(
            `/postos_proximos?lat=${lat}&lon=${lon}`
          );
          const postos = await response.json();

          if (postos.length === 0) {
            alert("Nenhum posto encontrado.");
          }

          postos.forEach((p: any) => {
            if (p.lat && p.lon) {
              const marker = L.marker([p.lat, p.lon], { icon: redIcon }).addTo(map);
              marker.bindPopup(
                `<div class="popup-content">
                  <b>${p.nome}</b><br><br>
                  <button id="detalhes-${p.lat}-${p.lon}">Ver Detalhes</button>
                </div>`
              );
              marker.on("popupopen", () => {
                setTimeout(() => {
                  const btn = document.getElementById(
                    `detalhes-${p.lat}-${p.lon}`
                  );
                  if (btn) {
                    btn.onclick = () => (window as any).mostrarOverlay(p.nome, p.medicamentos);
                  }
                }, 0);
              });
            }
          });
        } catch (error) {
          console.error("Erro ao buscar postos:", error);
          alert("Erro ao buscar postos.");
        }
      });

      // Funções overlay
      (window as any).mostrarOverlay = (nome: string, medicamentos: any[]) => {
        let content = `<h3>${nome}</h3>`;
        if (medicamentos && medicamentos.length > 0) {
          content += "<ul>";
          medicamentos.forEach((m) => {
            content += `<li>${m.nome} (${m.quantidade} un.)</li>`;
          });
          content += "</ul>";
        } else {
          content += "<p>Sem medicamentos disponíveis.</p>";
        }
        const overlayContent = document.getElementById("overlay-content");
        const overlay = document.getElementById("overlay");
        if (overlayContent && overlay) {
          overlayContent.innerHTML = content;
          overlay.style.display = "block";
        }
      };
      (window as any).fecharOverlay = () => {
        const overlay = document.getElementById("overlay");
        if (overlay) overlay.style.display = "none";
      };
    });
  }, []);

  return (
    <>
      <div className={styles.container}>
        <title>Mapa de Postos</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"
        />
      </div>
      <div id="map" ref={mapRef} className={styles.map}></div>
      <div id="overlay" className={styles.overlay}>
        <span id="overlay-content"></span>
        <button onClick={() => (window as any).fecharOverlay()}>Fechar</button>
      </div>
    </>
  );
}