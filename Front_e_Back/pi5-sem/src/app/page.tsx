"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home.module.css";
import { MapPin, Syringe, Calendar, Pill } from 'lucide-react';

import Card from "./components/cards/card";

import Lottie from "lottie-react";
import "leaflet/dist/leaflet.css";

export default function Home() {
  const [vacinaAnim, setVacinaAnim] = useState(null);
  const [doctorAnim, setDoctorAnim] = useState(null);
  const [comunityAnim, setComunityAnim] = useState(null);
  const [protectedAnim, setProtectedAnim] = useState(null);
  const [slaAnim, setSlaAnim] = useState(null);

  useEffect(() => {
    const fetchAnimations = async () => {
      try {
        const [vacinaRes, doctorRes, comunityRes, protectedRes, slaRes] = await Promise.all([
          fetch("/animation/Animation3.json"),
          fetch("/animation/Animation1.json"),
          fetch("/animation/Animation4.json"),
          fetch("/animation/Animation5.json"),
          fetch("/animation/Animation6.json"),
        ]);
        setVacinaAnim(await vacinaRes.json());
        setDoctorAnim(await doctorRes.json());
        setComunityAnim(await comunityRes.json());
        setProtectedAnim(await protectedRes.json());
        setSlaAnim(await slaRes.json());
      } catch (err) {
        console.error("Erro ao carregar as animações:", err);
      }
    };
    fetchAnimations();
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
            iconRetinaUrl: "/images/marker-icon-2x.png",
            iconUrl: "/images/marker-icon.png",
            shadowUrl: "/images/marker-shadow.png",
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
      <header className={styles.headerContainer}>
        <h1 className={styles.tileHeader}>Proteja Sua Saúde</h1>
        <p className={styles.descriptionHeader}>
          Vacinas são essenciais para prevenir doenças e proteger a saúde de
          todos. Descubra onde se vacinar e manter-se saudável.
        </p>
      </header>

      <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <MapPin className={styles.cardIcon} />
        <p className={styles.cardText}>Localizar<br /> Vacina</p>
      </div>

      <div className={styles.card}>
        <Syringe className={styles.cardIcon} />
        <p className={styles.cardText}>Vacinas<br /> Disponíveis</p>
      </div>

      <div className={styles.card}>
        <Calendar className={styles.cardIcon} />
        <p className={styles.cardText}>Calendário</p>
      </div>

      <div className={styles.card}>
        <Pill className={styles.cardIcon} />
        <p className={styles.cardText}>Remédios Disponíveis</p>
      </div>
    </div>
      
      <div className={styles.line}></div>

      <section className={styles.mapAndAnimationWrapper}>
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

        <div className={styles.animationBox}>
          {doctorAnim && (
            <>
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
            </>
          )}
        </div>
      </section>

      <div className={styles.line}></div>

      <section className={styles.news1}>
        <div className={styles.newTitle}>
          <h2>Vacine-se!</h2>
        </div>

        <div className={styles.newsContainer}>
          <div className={styles.newTextBlock}>
            <div className={styles.newText}>
              <div className={styles.textBox}>
                <p>
                  Você pode se vacinar gratuitamente nas salas de vacinação nas
                  Unidades Básicas de Saúde - UBS em todo o País. Consulte o
                  calendário de vacinação e verifique quais vacinas estão
                  disponíveis na sua região.
                </p>
              </div>
              <div className={styles.textBox}>
                <p>
                  Lembrando que a vacinação é um direito de todos e uma
                  responsabilidade social. Vacine-se e proteja a si mesmo e a
                  sua comunidade!
                </p>
              </div>
              <div className={styles.textBox}>
                <p>
                  A ausência do Cartão de Vacinação não impede que você seja
                  vacinado. Vá à UBS onde recebeu as vacinas e faça a segunda
                  via do seu cartão, ou solicite em uma outra unidade um novo
                  cartão. O cartão de vacinação é o documento que comprova a sua
                  situação vacinal. Lembre-se de guarda-lo junto aos seus
                  documentos pessoais.
                </p>
              </div>
            </div>
          </div>

          {vacinaAnim && (
            <div className={styles.animationWrapper}>
              <Lottie animationData={vacinaAnim} loop={true} />
            </div>
          )}
        </div>
      </section>

      <div className={styles.line}></div>

      <section className={styles.calendarSection}>
        <h2 className={styles.sectionTitle}>Calendário de Vacinação</h2>
        <p className={styles.sectionDescription}>
          Confira as vacinas recomendadas por faixa etária e grupos
          prioritários.
        </p>

        <div className={styles.calendarGrid}>
          <Card title="Criança" href="/crianca" />
          <Card title="Jovem e Adolescente" href="/jovem" />
          <Card title="Adulto" href="/adulto" />
          <Card title="Gestante" href="/gestante" />
          <Card title="Idoso" href="/idoso" />
        </div>
      </section>

      <div className={styles.line}></div>

      <section className={styles.benefitsSection}>
        <h2 className={styles.sectionTitle}>Por que se vacinar?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <div className={styles.comunityAnimation}>
              <Lottie animationData={protectedAnim} loop={true} />
            </div>
            <p>Previne doenças graves</p>
          </div>
          <div className={styles.benefitItem}>
            <div className={styles.comunityAnimation}>
              <Lottie animationData={slaAnim} loop={true} />
            </div>
            <p>Protege a comunidade</p>
          </div>
          <div className={styles.benefitItem}>
            <div className={styles.comunityAnimation}>
              <Lottie animationData={comunityAnim} loop={true} />
            </div>
            <p>Ajuda a controlar surtos</p>
          </div>
        </div>
      </section>

      <div className={styles.line}></div>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem}>
            <h3>Vacina causa autismo?</h3>
            <p>
              Não. Não há nenhuma evidência científica que comprove essa
              relação.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>Posso tomar mais de uma vacina no mesmo dia?</h3>
            <p>
              Sim, em geral é seguro. Mas consulte o profissional de saúde
              antes.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>É obrigatório vacinar meu filho?</h3>
            <p>
              Sim. O Estatuto da Criança e do Adolescente prevê a vacinação como
              obrigatória.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
