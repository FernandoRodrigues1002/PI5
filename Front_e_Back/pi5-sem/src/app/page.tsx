"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/home.module.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import 'leaflet/dist/leaflet.css';

export default function Home() {
  useEffect(() => {
    const fallbackImage = document.getElementById("fallback-image");
    const mapElement = document.getElementById("map");

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const L = await import('leaflet');

          // Corrigindo as imagens do marcador
          delete (L.Icon.Default.prototype as any)._getIconUrl;

          L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
            iconUrl: '/leaflet/images/marker-icon.png',
            shadowUrl: '/leaflet/images/marker-shadow.png',
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

            L.marker([lat, lng]).addTo(map).bindPopup("Você está aqui.").openPopup();
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
      <Navbar />
      <header className={styles.header}>
        <div className={styles.bgHeader}>
          <div className={styles.imgHeader}>
            <Image src="/images/doctor.png" alt="Doutora" width={800} height={400} style={{ width: "auto", height: "400px"}}/>
          </div>
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
              width={800}
              height={600}
              style={{ display: "none", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div className={styles.busca}>
            <h2 className={styles.titleBusca}>Onde se Vacinar?</h2>
            <div className={styles.pesquisa}>
              <input type="text" placeholder="Digite seu CEP" />
              <button>
                <Image src="/images/lupa.png" alt="Buscar" width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.news1}>
        <div className={styles.newTitle}>
          <h2>A Importância da Vacinação</h2>
        </div>

        <div className={styles.newsContainer}>
          <div className={styles.newTextBlock}>
            <div className={styles.newText}>
              <p>
                A vacinação é fundamental para a proteção da saúde individual e coletiva. 
                Por meio das vacinas, o corpo desenvolve defesas contra vírus e bactérias, 
                prevenindo doenças graves que podem causar complicações ou até a morte. 
                Além de proteger quem é vacinado, ela contribui para a chamada imunidade de rebanho, 
                reduzindo a circulação dos agentes infecciosos e protegendo pessoas que não podem se vacinar, 
                como recém-nascidos ou imunossuprimidos. Vacinar-se é um ato de responsabilidade com a própria saúde e com a sociedade.
              </p>
            </div>
          </div>

          <div>
            <Image
              src="/images/vacina.png"
              alt="Vacina"
              width={500}
              height={400}
              style={{ width: "500px", height: "300px"}}
            />
          </div>
        </div>
      </div>

      <Footer />

    </>
  );
}
