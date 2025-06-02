"use client";

import React from "react";
import styles from "./assinatura.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPills, FaBullhorn, FaBell, FaClipboardCheck } from "react-icons/fa";

export default function Page() {
  const router = useRouter();

  const handleSubscribe = () => {
    // Redireciona para a página de pagamento
    router.push("/pages/pagamento");
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoArea}>
        <img src="/images/logoWhite.png" alt="Logo" className={styles.logo} />
      </div>

      <h1 className={styles.title}>Assinatura Premium</h1>
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
    

      <p className={styles.backLink}>
        <Link href="/">Voltar para a página inicial</Link>
      </p>
    </div>
  );
}
