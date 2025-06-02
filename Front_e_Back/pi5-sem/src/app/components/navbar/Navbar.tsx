"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scroll pra baixo e já passou de 50px -> esconde a navbar
        setShowNavbar(false);
      } else {
        // Scroll pra cima -> mostra a navbar
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={styles.navbar}
      style={{
        transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease",
      }}
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
