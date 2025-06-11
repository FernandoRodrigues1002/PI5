import Link from 'next/link';
import styles from './calendario.module.css';
import Footer from '@/app/components/footer/Footer';
import { CalendarDays } from 'lucide-react';

const categorias = [
  { nome: 'Criança', rota: './crianca' },
  { nome: 'Gestante', rota: './gestante' },
  { nome: 'Adulto', rota: './adulto' },
  { nome: 'Idoso', rota: './idoso' },
  { nome: 'Jovem', rota: './jovem' }, 
];

export default function VacinaPage() {
  return (
    <>
      <main className={styles.container}>
        <h1 className={styles.title}>Calendário de Vacinação 2025</h1>
        <ul className={styles.lista}>
          {categorias.map(({ nome, rota }) => (
            <li key={rota} className={styles.item}>
              <Link href={rota} className={styles.link}>
                <CalendarDays size={40} className={styles.icon} />
                <span>{nome}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
