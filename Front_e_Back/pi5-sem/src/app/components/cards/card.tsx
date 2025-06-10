import React from 'react';
import styles from './card.module.css';

interface CardProps {
  title: string;
  href: string;
  subtitle?: string;
}
export default function Card({ title, href, subtitle }: CardProps) {
  return (
    <a href={href} className={styles.card}>
      <div className={styles.cardInfo}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.line}></div>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </a>
  );
}