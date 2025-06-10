import React, { useEffect, useRef } from "react";
import styles from "./card2.module.css";

interface CardProps {
  title: string;
  subtitle?: string;
}

export default function Card2({ title, subtitle }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    function animateCounter(element: HTMLElement, target: number) {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        const suffix = element.dataset.suffix || "";
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }, 20);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && numberRef.current) {
          const number = numberRef.current;
          const text = number.dataset.raw || "";
          const value = parseInt(text.replace(/\D/g, ""), 10);
          const suffix = text.replace(/\d/g, "");
          number.textContent = "0" + suffix;
          number.dataset.suffix = suffix;
          animateCounter(number, value);
          observer.unobserve(entry.target);
        }
      });
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [title]);

  return (
    <div className={`${styles.cardInfo} stat-item`} ref={cardRef}>
      <h2
        className={`stat-number ${styles.title}`}
        ref={numberRef}
        data-raw={title}
      >
        {title}
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
