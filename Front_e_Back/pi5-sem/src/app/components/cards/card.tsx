// components/CalendarCard.jsx
import styles from './card.module.css';

interface CardProps {
  title: string;
  href: string;
}

export default function Card({ title, href }: CardProps) {
  return (
    <a href={href} className={styles.card}>
      <div className={styles.cardInfo}>
        <span className={styles.title}>{title}</span>
      </div>
    </a>
  );
}
