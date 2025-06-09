"use client";

import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>MedLocator © Direitos Reservados</div>
      <div className={styles.footerCenter}>
        <Image
          src="/images/logoWhite.png"
          alt="MedLocator Logo"
          width={100}
          height={100}
          className={styles.footerLogo}
        />
      </div>
      <div className={styles.footerRight}>
        <a href="#">Direitos</a>
        <a href="/pages/sobre">Sobre</a>
        <a href="#">Contato</a>
      </div>
    </footer>
  );
}
