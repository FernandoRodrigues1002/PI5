"use client";

import { useState } from "react";
import styles from "./Pagamento.module.css";

export default function Pagamento() {
  const [loading, setLoading] = useState(false);

  async function iniciarPagamento() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar pagamento");
      }
    } catch {
      alert("Erro na comunicação com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Plano Premium - R$20,00</h1>
      <button
        onClick={iniciarPagamento}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Redirecionando..." : "Pagar R$20,00"}
      </button>
    </div>
  );
}
