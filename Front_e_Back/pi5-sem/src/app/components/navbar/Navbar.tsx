"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";

export default function Navbar() {

  return (
    <header
      className={styles.navbar}
    >
      <div className={styles.logoArea}>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="MedLocator Logo"
            width={50}
            height={50}
            className={styles.logo}
          />
        </Link>
      </div>
      <nav className={styles.navLinks}>
        <Link href="/">Início</Link>
        <Link href="/pages/localizar">Localizar</Link>
        <Link href="/pages/calendario">Calendário</Link>
        <Link href="/pages/assinatura">Assinatura</Link>
      </nav>
      <div className={styles.authLinks}>
        <Link href="/pages/login">Entrar</Link>
      </div>
    </header>
  );
}
