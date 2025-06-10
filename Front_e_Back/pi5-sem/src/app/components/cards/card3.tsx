import React from 'react';
import Lottie from 'lottie-react';
import styles from './card3.module.css';

interface CardProps {
  title: string;
  subtitle: string;
  animationData: object | null;
  animationsLoaded: boolean;
}

export default function Card3({ title, subtitle, animationData, animationsLoaded }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <div className={styles.animation}>
          {animationsLoaded && animationData ? (
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className={styles.animationPlaceholder}>
              <div className={styles.loadingDot}></div>
            </div>
          )}
        </div>
        <h3 className={styles.titleCard}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
