"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home.module.css";

import Lottie from "lottie-react";
import "leaflet/dist/leaflet.css";

export default function Home() {
  const [vacinaAnim, setVacinaAnim] = useState(null);
  const [doctorAnim, setDoctorAnim] = useState(null);

  useEffect(() => {
    fetch("/animation/Animation2.json")
      .then((res) => res.json())
      .then((data) => setVacinaAnim(data))
      .catch((err) => console.error("Erro ao carregar a animação:", err));
  }, []);

  useEffect(() => {
    fetch("/animation/Animation1.json")
      .then((res) => res.json())
      .then((data) => setDoctorAnim(data))
      .catch((err) => console.error("Erro ao carregar a animação:", err));
  }, []);

  useEffect(() => {
    const fallbackImage = document.getElementById("fallback-image");
    const mapElement = document.getElementById("map");

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const L = await import("leaflet");

          delete (
            L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown }
          )._getIconUrl;

          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
            iconUrl: "/leaflet/images/marker-icon.png",
            shadowUrl: "/leaflet/images/marker-shadow.png",
          });

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (mapElement) {
            const map = L.map(mapElement, {
              center: [lat, lng],
              zoom: 13,
              dragging: false,
              scrollWheelZoom: false,
              doubleClickZoom: false,
              boxZoom: false,
              keyboard: false,
              zoomControl: false,
              touchZoom: false,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            L.marker([lat, lng])
              .addTo(map)
              .bindPopup("Você está aqui.")
              .openPopup();
          }
        },
        function () {
          if (mapElement) mapElement.style.display = "none";
          if (fallbackImage) fallbackImage.style.display = "block";
        }
      );
    } else {
      if (mapElement) mapElement.style.display = "none";
      if (fallbackImage) fallbackImage.style.display = "block";
    }
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {doctorAnim && (
            <div className={styles.animationBox}>
              <div className={styles.doctorAnimation}>
                <Lottie animationData={doctorAnim} loop={true} />
              </div>
              <p className={styles.animationText}>ENCONTRE SUA VACINA!</p>
            </div>
          )}
        </div>
      </header>

      <section>
        <div className={styles.mapSection}>
          <div className={styles.mapBg}>
            <div id="map" className={styles.map}></div>
            <Image
              id="fallback-image"
              src="/images/map-fallback.png"
              alt="Mapa padrão"
              width={600}
              height={600}
              style={{
                display: "none",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div className={styles.busca}>
            <h2 className={styles.titleBusca}>Onde se Vacinar?</h2>
            <div className={styles.pesquisa}>
              <input type="text" placeholder="Digite seu CEP" />
              <button>
                <Image
                  src="/images/lupa.png"
                  alt="Buscar"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.news1}>
        <div className={styles.newTitle}>
          <h2>A Importância da Vacinação</h2>
        </div>

        <div className={styles.newsContainer}>
          <div className={styles.newTextBlock}>
            <div className={styles.newText}>
              <p>
                A vacinação é fundamental para a proteção da saúde individual e
                coletiva. Por meio das vacinas, o corpo desenvolve defesas
                contra vírus e bactérias, prevenindo doenças graves que podem
                causar complicações ou até a morte. Além de proteger quem é
                vacinado, ela contribui para a chamada imunidade de rebanho,
                reduzindo a circulação dos agentes infecciosos e protegendo
                pessoas que não podem se vacinar, como recém-nascidos ou
                imunossuprimidos. Vacinar-se é um ato de responsabilidade com a
                própria saúde e com a sociedade.
              </p>
            </div>
          </div>

          {vacinaAnim && (
            <div className={styles.animationWrapper}>
              <Lottie animationData={vacinaAnim} loop={true} style={{ width: '100%', height: '100%' }}/>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
