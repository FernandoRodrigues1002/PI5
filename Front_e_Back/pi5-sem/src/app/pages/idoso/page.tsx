"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from "./idoso.module.css";

type Vacina = {
  nome: string;
  doses: string;
  protecao: string;
  observacoes?: string;
};

const calendarioIdoso: Vacina[] = [
  {
    nome: "dT (Dupla adulto: Difteria e Tétano)",
    doses: "Reforço a cada 10 anos",
    protecao: "Difteria e tétano",
  },
  {
    nome: "Febre Amarela",
    doses: "Dose única (ou reforço conforme recomendação)",
    protecao: "Febre amarela",
  },
  {
    nome: "Tríplice Viral (Sarampo, Caxumba e Rubéola)",
    doses: "Dose única para quem não tem comprovação de vacinação",
    protecao: "Sarampo, caxumba e rubéola",
  },
  {
    nome: "Influenza (Gripe)",
    doses: "Dose anual",
    protecao: "Influenza sazonal",
    observacoes:
      "Preferencialmente vacina quadrivalente de alta concentração (HD4V)",
  },
  {
    nome: "Pneumocócica (VPC20, VPC15, VPC13 e VPP23)",
    doses: "Dose única ou esquema sequencial conforme avaliação médica",
    protecao: "Pneumonia causada pelo pneumococo",
  },
  {
    nome: "Herpes Zóster",
    doses: "Dose única (a partir de 50 anos)",
    protecao: "Herpes zóster",
    observacoes: "Disponível em clínicas particulares, não pelo SUS",
  },
  {
    nome: "Hepatite B",
    doses: "3 doses (0-1-6 meses)",
    protecao: "Hepatite B",
  },
  {
    nome: "Vírus Sincicial Respiratório (VSR - Abrysvo®)",
    doses: "Dose única entre 60 e 70 anos",
    protecao: "Infecções graves por VSR",
  },
  {
    nome: "COVID-19",
    doses: "Esquema conforme recomendação atualizada",
    protecao: "COVID-19",
  },
];

const Page: React.FC = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>

      <button className={styles.backButton} onClick={() => router.back()}>
        <ArrowLeft size={28} />
      </button>

      <h1 className={styles.title}>
        Calendário de Vacinação para Idosos (60+)
      </h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Vacina</th>
            <th>Doses / Reforços</th>
            <th>Proteção Contra</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {calendarioIdoso.map(({ nome, doses, protecao, observacoes }) => (
            <tr key={nome}>
              <td className={styles.vacinaNome}>{nome}</td>
              <td>{doses}</td>
              <td>{protecao}</td>
              <td>{observacoes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        A vacinação é gratuita nas Unidades Básicas de Saúde (UBS). Consulte seu
        médico para orientações específicas.
      </p>
    </div>
  );
};

export default Page;
