"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './crianca.module.css';


type Vacina = {
  nome: string;
  descricao?: string;
};

type FaixaEtaria = {
  idade: string;
  vacinas: Vacina[];
};

const calendario: FaixaEtaria[] = [
  {
    idade: 'Ao nascer',
    vacinas: [
      { nome: 'BCG', descricao: 'Proteção contra tuberculose' },
      { nome: '1ª dose da Hepatite B', descricao: 'Administrada nas primeiras 12 horas após o nascimento' },
    ],
  },
  {
    idade: '1 a 2 meses',
    vacinas: [
      { nome: 'Vacina Pentavalente', descricao: 'Difteria, tétano, coqueluche, hepatite B e Hib' },
      { nome: 'Vacina Oral da Poliomielite (VIP)' },
      { nome: 'Vacina contra Rotavírus' },
    ],
  },
  {
    idade: '3 a 6 meses',
    vacinas: [
      { nome: 'Doses adicionais da Pentavalente, VIP e Rotavírus' },
      { nome: 'Vacina Influenza (gripe)', descricao: 'Primeira vez com 2 doses, depois dose anual' },
    ],
  },
  {
    idade: '9 meses',
    vacinas: [
      { nome: 'Vacina contra Febre Amarela', descricao: '1ª dose' },
      { nome: 'Vacina Covid-19', descricao: '2 doses para Spikevax e 3 doses para Comirnaty, podendo ser aplicada até 4 anos e 11 meses' },
    ],
  },
  {
    idade: '12 meses',
    vacinas: [
      { nome: 'Vacina Tríplice Viral', descricao: 'Sarampo, caxumba e rubéola' },
      { nome: 'Vacina Pneumocócica 10 ou 13 valente' },
    ],
  },
  {
    idade: '15 a 24 meses',
    vacinas: [
      { nome: 'Reforço da Tríplice Viral' },
      { nome: 'Vacina contra Catapora (Varicela)' },
    ],
  },
  {
    idade: '4 a 6 anos',
    vacinas: [
      { nome: 'Reforço da Tríplice Bacteriana (DTP)' },
      { nome: 'Reforço da Febre Amarela' },
    ],
  },
];

const Page: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <ArrowLeft size={28} />
      </button>

      <h1 className={styles.title}>Calendário de Vacinação Infantil 2025</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Idade</th>
            <th>Vacinas</th>
          </tr>
        </thead>
        <tbody>
          {calendario.map(({ idade, vacinas }) => (
            <tr key={idade}>
              <td className={styles.idade}>{idade}</td>
              <td>
                <ul className={styles.vacinaList}>
                  {vacinas.map(({ nome, descricao }) => (
                    <li key={nome}>
                      <strong>{nome}</strong>
                      {descricao && `: ${descricao}`}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        Além disso, a vacinação contra Influenza é anual para crianças de 6 meses a menos de 6 anos, com esquema especial para as primeiras doses.
        A vacinação é gratuita e oferecida nas unidades básicas de saúde (UBS) e maternidades em todo o país.
      </p>
    </div>
  );
};

export default Page;
