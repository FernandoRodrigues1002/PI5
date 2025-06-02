"use client";

import React, { useEffect, useState } from "react";
import styles from "./calendario.module.css";

interface Vaccine {
  id: number;
  name: string;
  date: string;
}

const VaccineCalendar: React.FC = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const res = await fetch('/api/calendario');
        if (!res.ok) throw new Error('Erro ao buscar dados');
        const data = await res.json();
        setVaccines(data);
        setLoading(false);
      } catch {
        setError('Falha ao carregar dados da vacina.');
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  if (loading) return <div className={styles.loading}>Carregando calendário...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Calendário Anual de Vacinas 2024</h1>
      <div className={styles.calendar}>
        {vaccines.map((vaccine) => {
          const dateObj = new Date(vaccine.date);
          const monthName = dateObj.toLocaleString("pt-BR", { month: "long" });
          const day = dateObj.getDate();

          return (
            <div key={vaccine.id} className={styles.card}>
              <div className={styles.dateBox}>
                <span className={styles.day}>{day}</span>
                <span className={styles.month}>
                  {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                </span>
              </div>
              <div className={styles.info}>
                <span className={styles.vaccineName}>{vaccine.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VaccineCalendar;
