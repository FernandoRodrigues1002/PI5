"use client";

import React from "react";
import styles from "./assinatura.module.css";
import { FaPills, FaBullhorn, FaBell, FaClipboardCheck } from "react-icons/fa";
import Footer from '@/app/components/footer/Footer';


export default function Page() {
 

  const handleSubscribe = async () => {
    try {
      // Faz uma requisição para sua API que cria a sessão do Stripe
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao criar sessão de pagamento");
      }

      const data = await response.json();

      if (data.url) {
        // Redireciona o usuário para a página de checkout do Stripe
        window.location.href = data.url;
      } else {
        alert("Erro ao obter URL de pagamento");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao iniciar o pagamento. Tente novamente.");
    }
  };

  return (
    <>
    <div className={styles.container}>
      <div className={styles.logoArea}>
        <img src="/images/logoWhite.png" alt="Logo" className={styles.logo} />
      </div>

      <h1 className={styles.title}>Assinatura Premium</h1>
      
      {/* Novo campo de valor de pagamento */}
      <p className={styles.paymentAmount}>Por apenas <strong>R$20,00</strong></p>
      
      <p className={styles.description}>
        Desbloqueie todos os benefícios da nossa plataforma com a assinatura premium!
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <FaPills className={styles.icon} />
          <h2>Disponibilidade de Remédios</h2>
          <p>
            Acesse em tempo real a disponibilidade de medicamentos em UBSs ou farmácias.
          </p>
        </div>

        <div className={styles.card}>
          <FaBullhorn className={styles.icon} />
          <h2>Alertas de Campanhas</h2>
          <p>
            Receba notificações personalizadas sobre campanhas de vacinação, exames e ações de saúde.
          </p>
        </div>

        <div className={styles.card}>
          <FaBell className={styles.icon} />
          <h2>Notificações de Chegada</h2>
          <p>
            Seja avisado automaticamente quando o item estiver disponível no local selecionado.
          </p>
        </div>

        <div className={styles.card}>
          <FaClipboardCheck className={styles.icon} />
          <h2>Controle e Organização</h2>
          <p>
            Mantenha sua saúde em dia com avisos práticos e informações sempre atualizadas.
          </p>
        </div>
      </div>

      <button className={styles.subscribeButton} onClick={handleSubscribe}>
        Assinar Agora
      </button>
    </div>
    <Footer />
    </>
  );
}