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

            <div className={styles.textInputColumn}>
              <p className={styles.animationText}>ENCONTRE SUA VACINA!</p>
              <div className={styles.pesquisa}>
                <input type="text" placeholder="Digite seu CEP" />
                <button>
                  <Image
                    src="/svgs/lupa.svg"
                    alt="Buscar"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
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

        </div>
      </section>

      <section className={styles.news1}>
        <div className={styles.newTitle}>
          <h2>Vacine-se!</h2>
        </div>

        <div className={styles.newsContainer}>
          <div className={styles.newTextBlock}>
            <div className={styles.newText}>
              <p>
                Você pode se vacinar gratuitamente nas salas de vacinação nas Unidades Básicas de Saúde - UBS em todo o País.
                Consulte o calendário de vacinação e verifique quais vacinas estão disponíveis na sua região.
              </p>
              <p>
                Lembrando que a vacinação é um direito de todos e uma responsabilidade social.
                Vacine-se e proteja a si mesmo e a sua comunidade!
              </p>
              <p>
                A ausência do Cartão de Vacinação não impede que você seja vacinado.
                Vá à UBS onde recebeu as vacinas e faça a segunda via do seu cartão, 
                ou solicite em uma outra unidade um novo cartão. O cartão de vacinação é o documento que comprova a sua situação vacinal. 
                Lembre-se de guarda-lo junto aos seus documentos pessoais.
              </p>
            </div>
          </div>

          {vacinaAnim && (
            <div className={styles.animationWrapper}>
              <Lottie
                animationData={vacinaAnim}
                loop={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <h2 className={styles.sectionTitle}>Por que se vacinar?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <Image
              src=""
              alt="Proteção"
              width={50}
              height={50}
            />
            <p>Previne doenças graves</p>
          </div>
          <div className={styles.benefitItem}>
            <Image
              src=""
              alt="Família protegida"
              width={50}
              height={50}
            />
            <p>Protege a comunidade</p>
          </div>
          <div className={styles.benefitItem}>
            <Image
              src=""
              alt="Controle global"
              width={50}
              height={50}
            />
            <p>Ajuda a controlar surtos</p>
          </div>
        </div>
      </section>

      <section className={styles.calendarSection}>
        <h2 className={styles.sectionTitle}>Calendário de Vacinação</h2>
        <p className={styles.sectionDescription}>
          Confira as vacinas recomendadas por faixa etária e grupos
          prioritários.
        </p>
        <button className={styles.calendarButton}>
          Ver calendário completo
        </button>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem}>
            <h3>Vacina causa autismo?</h3>
            <p>Não. Não há nenhuma evidência científica que comprove essa relação.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Posso tomar mais de uma vacina no mesmo dia?</h3>
            <p>Sim, em geral é seguro. Mas consulte o profissional de saúde antes.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>É obrigatório vacinar meu filho?</h3>
            <p>Sim. O Estatuto da Criança e do Adolescente prevê a vacinação como obrigatória.</p>
          </div>
        </div>
      </section>

    </>
  );
}
