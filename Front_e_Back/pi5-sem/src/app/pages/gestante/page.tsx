"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './gestante.module.css';

type Vacina = {
  nome: string;
  descricao?: string;
  periodo?: string;
};

const calendarioGestante: Vacina[] = [
  {
    nome: 'Vacina dTpa (Difteria, Tétano e Coqueluche)',
    descricao: 'Dose única a cada gestação, a partir da 20ª semana',
    periodo: '20ª semana de gestação',
  },
  {
    nome: 'Vacina Influenza (Gripe)',
    descricao: 'Dose anual em qualquer trimestre da gestação',
    periodo: 'Qualquer trimestre',
  },
  {
    nome: 'Vacina Covid-19',
    descricao: 'Dose única em cada gestação para proteção da mãe e do bebê',
    periodo: 'Qualquer trimestre',
  },
  {
    nome: 'Vacina contra Hepatite B',
    descricao: 'Indicação conforme fatores de risco, esquema 0-1-6 meses',
  },
  {
    nome: 'Vacina Vírus Sincicial Respiratório (VSR - Abrysvo®)',
    descricao: 'Dose única entre 32 e 36 semanas, independente da sazonalidade',
    periodo: '32 a 36 semanas',
  },
  {
    nome: 'Vacina Tríplice Viral (Sarampo, Caxumba e Rubéola)',
    descricao: 'Contraindicada na gestação, pode ser aplicada no puerpério',
  },
];

const Page: React.FC = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <ArrowLeft size={28} />
      </button>

      <h1 className={styles.title}>Calendário de Vacinação para Gestantes 2025</h1>
      <p className={styles.intro}>
        Tomar as vacinas recomendadas durante a gravidez ajuda a proteger você e seu bebê de doenças potencialmente graves.
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Vacina</th>
            <th>Descrição</th>
            <th>Período recomendado</th>
          </tr>
        </thead>
        <tbody>
          {calendarioGestante.map(({ nome, descricao, periodo }) => (
            <tr key={nome}>
              <td className={styles.vacinaNome}>{nome}</td>
              <td>{descricao}</td>
              <td>{periodo || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        A vacinação é gratuita e oferecida nas unidades básicas de saúde (UBS) e maternidades. Consulte sempre o calendário oficial atualizado e seu médico.
      </p>
    </div>
  );
};

export default Page;
