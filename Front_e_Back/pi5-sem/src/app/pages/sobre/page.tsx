"use client";

import Image from "next/image";
import styles from "./sobre.module.css";
import { MapPin, Pill, Syringe, Bell } from "lucide-react";
import Footer from "../../components/footer/Footer";

export default function Sobre() {
  const criadores = [
    {
      nome: "Olavo Moretto",
      imagem: "/images/creator1.jpg",
      GitHub: "https://github.com/Moretto04"
    },
    {
      nome: "Fernando Rodrigues",
      imagem: "/images/creator2.jpg",
      GitHub: "https://github.com/FernandoRodrigues1002"
    },
    {
      nome: "Eric Cordeiro ",
      imagem: "/images/creator3.jpg",
      GitHub: "https://github.com/Cordeirx"
    },
    {
      nome: "João Pedro",
      imagem: "/images/creator4.jpg",
      GitHub: "https://github.com/jpalmeida-dev"
    }
  ];

  return (
    <>
      <div className={styles.header}>
        <Image
          src="/images/aboutImg.jpg"
          alt="Farmácia e medicamentos"
          width={1920}
          height={1080}
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
        <h1 className={styles.title}>Sobre Nós</h1>
      </div>

      <h2 className={styles.sectionTitle}>Funcionalidades</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <MapPin size={40} />
          <p className={styles.cardText}>Localização</p>
        </div>
        <div className={styles.card}>
          <Pill size={40} />
          <p className={styles.cardText}>Medicamentos</p>
        </div>
        <div className={styles.card}>
          <Syringe size={40} />
          <p className={styles.cardText}>Vacinas</p>
        </div>
        <div className={styles.card}>
          <Bell size={40} />
          <p className={styles.cardText}>Notificações</p>
        </div>
      </div>

      <div className={styles.history}>
        <h2>Nossa História</h2>
        <p>Em muitas comunidades brasileiras, principalmente nas regiões mais carentes, encontrar um posto de saúde com os medicamentos necessários pode ser uma verdadeira jornada. Faltam informações acessíveis, atualizadas e organizadas. Muitas vezes, o cidadão percorre longas distâncias apenas para descobrir que o remédio que precisa não está disponível.</p>
        <p>Diante dessa realidade, nasceu o projeto MedLocator — uma plataforma digital desenvolvida com o objetivo de aproximar a população dos serviços de saúde pública, permitindo que qualquer pessoa possa localizar postos de saúde próximos e verificar, em tempo real, quais medicamentos estão disponíveis em cada unidade.</p>
        <p>O sistema oferece uma experiência simples, rápida e acessível. Basta informar o CEP ou usar a localização atual, e o usuário visualiza os postos de saúde mais próximos, podendo clicar para ver os detalhes dos medicamentos ofertados.</p>
        <p>Mais do que um projeto de software, o MedLocator representa um compromisso com a inclusão digital, com o fortalecimento do SUS, e com a dignidade das pessoas que dependem do serviço público para cuidar da própria saúde.</p>
      </div>

      <h2 className={styles.sectionTitle}>Criadores</h2>
      <div className={styles.criadores}>
        {criadores.map((criador, index) => (
          <div className={styles.criador} key={index}>
            <Image
              src={criador.imagem}
              alt={`Criador ${criador.nome}`}
              width={150}
              height={150}
              className={styles.creatorImg}
            />
            <div className={styles.overlayInfo}>
              <p>{criador.nome}</p>
              <a href={criador.GitHub} target="_blank">GitHub</a>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.history}>
        <h2>Agradecimentos</h2>
        <p>Obrigado!</p>
      </div>
      <Footer />
    </>
  );
}
