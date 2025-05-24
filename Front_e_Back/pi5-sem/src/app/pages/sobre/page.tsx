"use client";

import Image from "next/image";
import styles from "../styles/sobre.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Sobre() {
  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Sobre o Projeto</h1>
          <p>
            Este projeto tem como objetivo facilitar a busca por medicamentos
            disponíveis nas Unidades Básicas de Saúde (UBS) próximas à sua
            localização. Através da integração com geolocalização e dados
            atualizados das UBS, você pode encontrar rapidamente onde
            determinado medicamento está disponível, agilizando o acesso ao
            tratamento e promovendo saúde para todos.
          </p>
          <div className={styles.imageContainer}>
            <Image
              src="/images/pharmacy.png"
              alt="Farmácia e medicamentos"
              width={600}
              height={400}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
        </section>

        <section className={styles.features}>
          <h2>Funcionalidades Principais</h2>
          <ul>
            <li>
              <strong>Busca por CEP:</strong> Digite seu CEP para encontrar
              medicamentos disponíveis nas UBS de sua região.
            </li>
            <li>
              <strong>Localização automática:</strong> Caso permita o acesso à
              sua localização, o sistema encontra UBS próximas automaticamente.
            </li>
            <li>
              <strong>Informações atualizadas:</strong> Dados em tempo real
              sobre a disponibilidade dos medicamentos.
            </li>
            <li>
              <strong>Interface intuitiva:</strong> Fácil navegação para todos
              os usuários, com acessibilidade e responsividade.
            </li>
          </ul>
        </section>

        <section className={styles.whyUse}>
          <h2>Por que usar este serviço?</h2>
          <p>
            Muitas vezes, encontrar um medicamento disponível em uma UBS próxima
            é um desafio que pode atrasar o tratamento. Com esta plataforma,
            você economiza tempo, evita deslocamentos desnecessários e tem
            acesso rápido às informações essenciais para sua saúde.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
