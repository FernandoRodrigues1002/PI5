import React from 'react';
import styles from './jovens.module.css';

type Vacina = {
  nome: string;
  esquema: string;
  observacoes?: string;
};

const calendarioJovens: Vacina[] = [
  {
    nome: 'HPV (Papilomavírus Humano)',
    esquema: 'Dose única para 9 a 14 anos; 2 doses com intervalo de 6 meses para não vacinados; esquema especial para maiores de 20 anos',
    observacoes: 'Protege contra câncer de colo de útero, vulva, vagina, pênis, ânus e orofaringe',
  },
  {
    nome: 'Tríplice Viral (Sarampo, Caxumba e Rubéola)',
    esquema: '2 doses para quem não tem comprovação de vacinação',
  },
  {
    nome: 'Vacina contra Meningite ACWY',
    esquema: 'Dose única para adolescentes',
  },
  {
    nome: 'Vacina contra Febre Amarela',
    esquema: 'Dose única ou reforço conforme situação epidemiológica',
  },
  {
    nome: 'Vacina contra COVID-19',
    esquema: 'Esquema conforme recomendação atualizada',
  },
  {
    nome: 'Vacina contra Hepatite B',
    esquema: '3 doses para não vacinados ou esquema incompleto',
  },
  {
    nome: 'Vacina contra Hepatite A',
    esquema: 'Dose única para não vacinados',
  },
  {
    nome: 'Vacina contra Influenza (Gripe)',
    esquema: 'Dose anual para grupos de risco',
  },
];

const Page: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Calendário de Vacinação para Jovens e Adolescentes (10 a 24 anos) - 2025</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Vacina</th>
            <th>Esquema</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {calendarioJovens.map(({ nome, esquema, observacoes }) => (
            <tr key={nome}>
              <td className={styles.vacinaNome}>{nome}</td>
              <td>{esquema}</td>
              <td>{observacoes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        A vacinação é gratuita nas Unidades Básicas de Saúde (UBS). Consulte sempre o calendário oficial atualizado e seu médico.
      </p>
    </div>
  );
};

export default Page;
