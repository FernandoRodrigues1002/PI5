"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home.module.css";

import Card from "./components/cards/card";

import Lottie from "lottie-react";
import "leaflet/dist/leaflet.css";

import SmoothScrollContainer from "./components/scroll/SmoothScrollContainer";
import AnimatedSection from "./components/scroll/AnimatedSection";
import Footer from "./components/footer/Footer";

export default function Home() {
  const faqSections = [
    {
      faqs: [
        {
          question: "O que são as vacinas?",
          answer:
            "As vacinas são substâncias preparadas e aplicadas na população para proteger contra doenças graves e muitas vezes fatais...",
        },
        {
          question: "Como as vacinas funcionam?",
          answer:
            "As vacinas ajudam o sistema de defesa da pessoa a combater infecções de maneira mais eficiente...",
        },
        {
          question: "Como agendar a vacinação?",
          answer:
            "Você pode agendar a vacinação diretamente pelo site ou aplicativo MedLocator...",
        },
        {
          question: "Posso cancelar meu agendamento?",
          answer:
            "Sim, o cancelamento pode ser feito até 24 horas antes da data marcada.",
        },
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  const toggleFAQ = (index: string) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Estados das animações com verificação de carregamento
  const [doctorAnim, setDoctorAnim] = useState(null);
  const [comunityAnim, setComunityAnim] = useState(null);
  const [protectedAnim, setProtectedAnim] = useState(null);
  const [slaAnim, setSlaAnim] = useState(null);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);

  useEffect(() => {
    const fetchAnimations = async () => {
      try {
        const [doctorRes, comunityRes, protectedRes, slaRes] =
          await Promise.all([
            fetch("/animation/AnimationSearch.json"),
            fetch("/animation/AnimationWorld.json"),
            fetch("/animation/AnimationProtected.json"),
            fetch("/animation/AnimationSla.json"),
          ]);

        const [doctor, community, protectedAnim, sla] = await Promise.all([
          doctorRes.json(),
          comunityRes.json(),
          protectedRes.json(),
          slaRes.json(),
        ]);

        setDoctorAnim(doctor);
        setComunityAnim(community);
        setProtectedAnim(protectedAnim);
        setSlaAnim(sla);
        setAnimationsLoaded(true);
      } catch (err) {
        console.error("Erro ao carregar as animações:", err);
        setAnimationsLoaded(false);
      }
    };
    fetchAnimations();
  }, []);

  useEffect(() => {
    const fallbackImage = document.getElementById("fallback-image");
    const mapElement = document.getElementById("leaflet-map"); // Mudança aqui: ID específico para o mapa

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
      <SmoothScrollContainer totalSections={6}>
        {" "}
        {/* Seção Header */}
        <AnimatedSection id="header" className={styles.sections}>
          <section className={styles.headerContainer}>
            <Image
              src="/images/background.jpg"
              alt="Background"
              fill
              className={styles.headerBackgroundImage}
              priority
            />
            <h1 className={styles.tileHeader}>Proteja Sua Saúde</h1>
            <p className={styles.descriptionHeader}>
              Vacinas são essenciais para prevenir doenças e proteger a saúde de
              todos. Descubra onde se vacinar e manter-se saudável.
            </p>
          </section>
        </AnimatedSection>
        {/* Seção Mapa */}
        <AnimatedSection id="map-section" className={styles.sections}>
          <section className={styles.containerMapSearch}>
            <div className={styles.titleMapSearch}>
              <h2>ENCONTRE SUA VACINA!</h2>
            </div>

            <div className={styles.mapAnimationWrapper}>
              <div className={styles.map}>
                {/* Elemento do mapa Leaflet com ID específico */}
                <div
                  id="leaflet-map"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "400px",
                    borderRadius: "8px",
                  }}
                />

                {/* Imagem de fallback */}
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
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className={styles.animationBox}>
                <div className={styles.doctorAnimation}>
                  {animationsLoaded && doctorAnim ? (
                    <Lottie
                      animationData={doctorAnim}
                      loop={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className={styles.animationPlaceholder}>
                      Carregando...
                    </div>
                  )}
                </div>

                <div className={styles.pesquisa}>
                  <input
                    type="number"
                    autoComplete="off"
                    id="cep"
                    required
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const cep = (e.target as HTMLInputElement).value;
                        if (cep && cep.length >= 8) {
                          window.location.href = `/pages/localizar?cep=${cep}`;
                        } else {
                          alert("Digite um CEP válido!");
                        }
                      }
                    }}
                  />
                  <label htmlFor="cep">Digite seu CEP</label>
                  <button
                    type="button"
                    onClick={() => {
                      const cep = (
                        document.getElementById("cep") as HTMLInputElement
                      )?.value;
                      if (cep && cep.length >= 8) {
                        window.location.href = `/pages/localizar?cep=${cep}`;
                      } else {
                        alert("Digite um CEP válido!");
                      }
                    }}
                  >
                    <Image
                      src="/svgs/lupa.svg"
                      alt="Buscar"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
        {/* Seção Informativa */}
        <AnimatedSection id="news" className={styles.sections}>
          <section className={styles.news}>
            <Image
              src="/images/aplicando.jpg"
              alt="Background"
              fill
              style={{ objectFit: "cover", zIndex: -1 }}
              priority
            />

            <div className={styles.newsContent}>
              <div className={styles.newTitle}>
                <h2>Como vou encontrar minha Vacina?</h2>
              </div>

              <div className={styles.newText}>
                <div className={styles.textBox}>
                  <p>
                    Para encontrar sua vacina com o MedLocator, basta permitir
                    que o site acesse sua localização atual. Em poucos segundos,
                    mostramos as Unidades Básicas de Saúde (UBSs) mais próximas
                    de você e indicamos se elas têm a vacina disponível.
                  </p>
                </div>
                <div className={styles.textBox}>
                  <p>
                    Quer saber onde encontrar a vacina que precisa? É simples!
                    Digite o nome da vacina no campo de busca do MedLocator e,
                    automaticamente, nossa plataforma verifica a disponibilidade
                    nas UBSs próximas ao seu endereço.
                  </p>
                </div>
                <div className={styles.textBox}>
                  <p>
                    Com o MedLocator, localizar sua vacina ficou fácil e rápido.
                    Basta usar a geolocalização do seu dispositivo ou informar
                    seu endereço manualmente.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
        {/* Seção Calendário */}
        <AnimatedSection id="calendar" className={styles.sections}>
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
        </AnimatedSection>
        {/* Seção Benefícios */}
        <AnimatedSection id="benefit" className={styles.sections}>
          <section className={styles.benefitsSection}>
            <h2 className={styles.sectionTitle}>Por que se vacinar?</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <div className={styles.comunityAnimation}>
                  {animationsLoaded && protectedAnim ? (
                    <Lottie
                      animationData={protectedAnim}
                      loop={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className={styles.animationPlaceholder}>
                      <div className={styles.loadingDot}></div>
                    </div>
                  )}
                </div>
                <p>Previne doenças graves</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.comunityAnimation}>
                  {animationsLoaded && slaAnim ? (
                    <Lottie
                      animationData={slaAnim}
                      loop={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className={styles.animationPlaceholder}>
                      <div className={styles.loadingDot}></div>
                    </div>
                  )}
                </div>
                <p>Protege a comunidade</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.comunityAnimation}>
                  {animationsLoaded && comunityAnim ? (
                    <Lottie
                      animationData={comunityAnim}
                      loop={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className={styles.animationPlaceholder}>
                      <div className={styles.loadingDot}></div>
                    </div>
                  )}
                </div>
                <p>Ajuda a controlar surtos</p>
              </div>
            </div>
          </section>
        </AnimatedSection>
        {/* Seção FAQ */}
        <AnimatedSection id="faq">
          <section className={styles.faqSection}>
            <div style={{ flex: 1 }}>
            <div className={styles.sectionTitle}>
              <h2>Perguntas Frequentes (FAQ)</h2>
            </div>

            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className={styles.faqSectionBlock}>
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
                            {activeIndex === index ? "-" : "+"}
                          </span>
                        </h4>

                        {activeIndex === index && (
                          <p className={styles.faqAnswer}>{faq.answer}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            </div>
          <Footer />
          </section>
        </AnimatedSection>
      </SmoothScrollContainer>
    </>
  );
}
