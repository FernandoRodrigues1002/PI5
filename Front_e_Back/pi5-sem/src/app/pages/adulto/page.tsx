import React from 'react';
import styles from './adulto.module.css';

type Vacina = {
  nome: string;
  esquema: string;
  observacoes?: string;
};

const calendarioAdulto: Vacina[] = [
  {
    nome: 'dT (Dupla adulto: Difteria e Tétano)',
    esquema: 'Reforço a cada 10 anos',
    observacoes: 'Atualizar com dTpa (dT acelular) preferencialmente',
  },
  {
    nome: 'Febre Amarela',
    esquema: 'Dose única',
    observacoes: 'Reforço conforme recomendação e situação epidemiológica',
  },
  {
    nome: 'Influenza (Gripe)',
    esquema: 'Dose anual',
    observacoes: 'Para adultos a partir dos 60 anos; dose adicional em imunodeprimidos e grupos de risco',
  },
  {
    nome: 'Pneumocócica 23-valente (VPP23)',
    esquema: 'Dose única',
    observacoes: 'Indicado para adultos com comorbidades e idosos',
  },
  {
    nome: 'Pneumocócica 10 ou 13 valente (VPC10/VPC13)',
    esquema: 'Esquema conforme avaliação médica',
    observacoes: 'Para adultos com comorbidades específicas',
  },
  {
    nome: 'Hepatite B',
    esquema: '3 doses (0-1-6 meses)',
    observacoes: 'Para adultos não vacinados ou com esquema incompleto',
  },
  {
    nome: 'Hepatite A e B (combinada)',
    esquema: '3 doses (0-1-6 meses)',
    observacoes: 'Alternativa para proteção contra ambas as hepatites',
  },
  {
    nome: 'Varicela (Catapora)',
    esquema: '2 doses',
    observacoes: 'Especialmente para adultos não imunizados e povos indígenas',
  },
  {
    nome: 'HPV (Papilomavírus Humano)',
    esquema: '3 doses (0-1-6 meses)',
    observacoes: 'Para adultos até 45 anos, especialmente mulheres',
  },
  {
    nome: 'Tríplice Viral (Sarampo, Caxumba e Rubéola)',
    esquema: '2 doses para adultos sem comprovação de vacinação',
  },
  {
    nome: 'COVID-19',
    esquema: 'Esquema conforme recomendação atualizada',
    observacoes: 'Vacinação para adultos não vacinados e reforços conforme idade e risco',
  },
];

const CalendarioAdulto: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Calendário de Vacinação para Adultos 2025</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Vacina</th>
            <th>Esquema</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {calendarioAdulto.map(({ nome, esquema, observacoes }) => (
            <tr key={nome}>
              <td className={styles.vacinaNome}>{nome}</td>
              <td>{esquema}</td>
              <td>{observacoes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        A vacinação é gratuita nas Unidades Básicas de Saúde (UBS). Consulte seu médico para orientações específicas.
      </p>
    </div>
  );
};

export default CalendarioAdulto;
