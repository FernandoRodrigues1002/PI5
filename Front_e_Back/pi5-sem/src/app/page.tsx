"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home.module.css";
import { MapPin, Syringe, Calendar, Pill } from 'lucide-react';

import Card from "./components/cards/card";

import Lottie from "lottie-react";
import "leaflet/dist/leaflet.css";

export default function Home() {
  const faqSections = [
    {
      title: "Vacinas",
      faqs: [
        {
          question: "O que são as vacinas?",
          answer: "As vacinas são substâncias preparadas e aplicadas na população para proteger contra doenças graves e muitas vezes fatais..."
        },
        {
          question: "Como as vacinas funcionam?",
          answer: "As vacinas ajudam o sistema de defesa da pessoa a combater infecções de maneira mais eficiente..."
        }
      ]
    },
    {
      title: "Agendamento",
      faqs: [
        {
          question: "Como agendar a vacinação?",
          answer: "Você pode agendar a vacinação diretamente pelo site ou aplicativo MedLocator..."
        },
        {
          question: "Posso cancelar meu agendamento?",
          answer: "Sim, o cancelamento pode ser feito até 24 horas antes da data marcada."
        }
      ]
    }
  ];

const [activeIndex, setActiveIndex] = useState<string | null>(null);

const toggleFAQ = (index: string) => {
  setActiveIndex(activeIndex === index ? null : index);
};



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

      <div className={styles.containerMap}>
        <div className={styles.cardsContainer}>
          <a href="/pages/localizar">
            <div className={styles.card}>
              <MapPin className={styles.cardIcon} />
              <p className={styles.cardText}>Localizar<br /> Vacina</p>
            </div>
          </a>

          <a href="/vacinas">
            <div className={styles.card}>
              <Syringe className={styles.cardIcon} />
              <p className={styles.cardText}>Vacinas<br /> Disponíveis</p>
            </div>
          </a>

          <a href="/pages/calendario">
            <div className={styles.card}>
              <Calendar className={styles.cardIcon} />
              <p className={styles.cardText}>Calendário</p>
            </div>
          </a>

          <a href="/login">
            <div className={styles.card}>
              <Pill className={styles.cardIcon} />
              <p className={styles.cardText}>Remédios Disponíveis</p>
            </div>
          </a>
        </div>

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
      </div>

      <section className={styles.news1}>
        <div className={styles.newTitle}>
          <h2>Como vou encontrar minha Vacina?</h2>
        </div>

        <div className={styles.newsContainer}>
          <div className={styles.newTextBlock}>
            <div className={styles.newText}>
              <div className={styles.textBox}>
                <p>
                  Para encontrar sua vacina com o MedLocator, basta permitir que o site acesse sua localização atual.
                  Em poucos segundos, mostramos as Unidades Básicas de Saúde (UBSs) mais próximas de você e indicamos se elas têm a vacina disponível.
                  Assim, você economiza tempo e evita deslocamentos desnecessários, indo direto ao local certo.
                </p>
              </div>
              <div className={styles.textBox}>
                <p>
                  Quer saber onde encontrar a vacina que precisa?
                  É simples! Digite o nome da vacina no campo de busca do MedLocator e, automaticamente,
                  nossa plataforma verifica a disponibilidade nas UBSs próximas ao seu endereço.
                  Você terá informações atualizadas para planejar sua ida com segurança e praticidade.
                </p>
              </div>
              <div className={styles.textBox}>
                <p>
                  Com o MedLocator, localizar sua vacina ficou fácil e rápido.
                  Basta usar a geolocalização do seu dispositivo ou informar seu endereço manualmente.
                  Nosso sistema verifica em tempo real quais unidades de saúde possuem a vacina que você procura,
                  garantindo que você tenha acesso rápido e seguro à imunização.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className={styles.calendarSection}>
        <h2 className={styles.sectionTitle}>Calendário de Vacinação</h2>
        <p className={styles.sectionDescription}>
          Confira as vacinas recomendadas por faixa etária e grupos
          prioritários.
        </p>

        <div className={styles.calendarGrid}>
          <Card title="Criança" href="./pages/crianca" />
          <Card title="Jovem e Adolescente" href="./pages/jovem" />
          <Card title="Adulto" href="./pages/adulto" />
          <Card title="Gestante" href="./pages/gestante" />
          <Card title="Idoso" href="./pages/idoso" />
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Perguntas Frequentes (FAQ)</h2>

        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.faqSectionBlock}>
            <h3 className={styles.faqSectionTitle}>{section.title}</h3>

            <div className={styles.faqContainer}>
              {section.faqs.map((faq, faqIndex) => {
                const index = `${sectionIndex}-${faqIndex}`;
                return (
                  <div key={index} className={styles.faqItem}>
                    <h4
                      onClick={() => toggleFAQ(index)}
                      className={styles.faqQuestion}
                    >
                      {faq.question}
                      <span className={styles.arrow}>
                        {activeIndex === index ? '▲' : '▼'}
                      </span>
                    </h4>

                    {activeIndex === index && (
                      <p className={styles.faqAnswer}>{faq.answer}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

    </>
  );
}
