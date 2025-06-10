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
import Card2 from "./components/cards/card2";
import Card3 from "./components/cards/card3";

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
        {
          question: "Benefícios Adicionais",
          answer: [
            "Reduz custos médicos a longo prazo",
            "Melhora a qualidade de vida",
            "Protege gerações futuras",
            "Contribui para a erradicação de doenças",
            "Reduz complicações em grupos de risco",
            "Fortalece o sistema de saúde pública",
          ],
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
    const mapElement = document.getElementById("leaflet-map");

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
        {/* Seção Header */}
        <AnimatedSection
          id="header"
          className={styles.sections}
          sectionIndex={0}
        >
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
        <AnimatedSection
          id="map-section"
          className={styles.sections}
          sectionIndex={1}
        >
          <section className={styles.containerMapSearch}>
            <div className={styles.sectionTitle}>
              <h2>ENCONTRE SUA VACINA!</h2>
            </div>

            <div className={styles.mapAnimationWrapper}>
              <div className={styles.map}>
                <div
                  id="leaflet-map"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "400px",
                    borderRadius: "8px",
                  }}
                />

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
        <AnimatedSection id="news" className={styles.sections} sectionIndex={2}>
          <section className={styles.news}>
            <Image
              src="/images/aplicando.jpg"
              alt="Background"
              fill
              className={styles.newsBackgroundImage}
              style={{ objectFit: "cover", zIndex: -1 }}
              priority
            />

            <div className={styles.newsContent}>
              <div className={styles.sectionTitle}>
                <h2>Como vou encontrar minha Vacina?</h2>
              </div>

              <div className={styles.textBox}>
                <div className={styles.newText}>
                  <p>
                    Para encontrar sua vacina com o MedLocator, basta permitir
                    que o site acesse sua localização atual. Em poucos segundos,
                    mostramos as Unidades Básicas de Saúde (UBSs) mais próximas
                    de você e indicamos se elas têm a vacina disponível.
                  </p>
                </div>
                <div className={styles.newText}>
                  <p>
                    Quer saber onde encontrar a vacina que precisa? É simples!
                    Digite o nome da vacina no campo de busca do MedLocator e,
                    automaticamente, nossa plataforma verifica a disponibilidade
                    nas UBSs próximas ao seu endereço.
                  </p>
                </div>
                <div className={styles.newText}>
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
        <AnimatedSection
          id="calendar"
          className={styles.sections}
          sectionIndex={3}
        >
          <section className={styles.calendarSection}>
            <div className={styles.sectionTitle}>
              <h2>Calendário de Vacinação</h2>
              <p className={styles.sectionDescription}>
                Confira as vacinas recomendadas por faixa etária e grupos
                prioritários.
              </p>
            </div>

            <div className={styles.calendarGrid}>
              <Card
                title="Criança"
                subtitle="Vacinas essenciais para proteção desde o nascimento até os 12 anos"
                href="./pages/crianca"
              />
              <Card
                title="Jovem e Adolescente"
                subtitle="Imunização importante para a fase de crescimento e desenvolvimento"
                href="./pages/jovem"
              />
              <Card
                title="Adulto"
                subtitle="Manutenção da proteção e prevenção de doenças ocupacionais"
                href="./pages/adulto"
              />
              <Card
                title="Gestante"
                subtitle="Proteção especial para mãe e bebê durante a gravidez"
                href="./pages/gestante"
              />
              <Card
                title="Idoso"
                subtitle="Reforço da imunidade para a terceira idade"
                href="./pages/idoso"
              />
            </div>

            <div className={styles.calendarStats}>
              <Card2 title="20+" subtitle="Tipos de vacinas disponíveis" />
              <Card2 title="95%" subtitle="Eficácia média" />
              <Card2 title="1000+" subtitle="Pessoas protegidas" />
              <Card2 title="500+" subtitle="Pontos de vacinação" />
            </div>
          </section>
        </AnimatedSection>

        {/* Seção Benefícios */}
        <AnimatedSection
          id="benefit"
          className={styles.sections}
          sectionIndex={4}
        >
          <section className={styles.benefitsSection}>
            <div className={styles.sectionTitle}>
              <h2>Por que se vacinar?</h2>
              <p className={styles.sectionDescription}>
                A vacinação é uma das medidas mais eficazes para prevenir
                doenças e salvar vidas
              </p>
            </div>

            <div className={styles.benefitsCards}>
              <div className={styles.benefitItem}>
                <Card3
                  title="Previne doenças graves"
                  subtitle="As vacinas estimulam o sistema imunológico a produzir
                  anticorpos, criando uma barreira de proteção contra doenças
                  potencialmente fatais."
                  animationData={protectedAnim}
                  animationsLoaded={animationsLoaded}
                />
              </div>
              <div className={styles.benefitItem}>
                <Card3
                  title="Protege a comunidade"
                  subtitle="Quando a maioria se vacina, criamos a imunidade coletiva, protegendo também aqueles que não podem se vacinar."
                  animationData={slaAnim}
                  animationsLoaded={animationsLoaded}
                />
              </div>
              <div className={styles.benefitItem}>
                <Card3
                  title="Ajuda a controlar surtos"
                  subtitle="A vacinação em massa é fundamental para prevenir e controlar
                  surtos de doenças infecciosas em nossa sociedade."
                  animationData={comunityAnim}
                  animationsLoaded={animationsLoaded}
                />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Seção FAQ */}
        <AnimatedSection id="faq" sectionIndex={5}>
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

                          {activeIndex === index &&
                            (Array.isArray(faq.answer) ? (
                              <ul className={styles.faqAnswerList}>
                                {faq.answer.map((item, i) => (
                                  <li key={i} className={styles.faqAnswerItem}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className={styles.faqAnswer}>{faq.answer}</p>
                            ))}
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
