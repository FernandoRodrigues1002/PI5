"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.logoArea}>
          <Link href="/" onClick={closeMobileMenu}>
            <p className={styles.logoText}>
              <span className={styles.logoMed}>Med</span>Locator
            </p>
          </Link>
        </div>

        {/* Links de navegação desktop */}
        <nav className={styles.navLinks}>
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            Início
          </Link>
          <Link
            href="/pages/localizar"
            className={pathname === "/pages/localizar" ? "active" : ""}
          >
            Localizar
          </Link>
          <Link
            href="/pages/calendario"
            className={pathname === "/pages/calendario" ? "active" : ""}
          >
            Calendário
          </Link>
          <Link
            href="/pages/assinatura"
            className={pathname === "/pages/assinatura" ? "active" : ""}
          >
            Assinatura
          </Link>
          <Link
            href="/pages/sobre"
            className={pathname === "/pages/sobre" ? "active" : ""}
          >
            Sobre
          </Link>
        </nav>

        {/* Links de autenticação desktop */}
        <div className={styles.authLinks}>
          {usuario ? (
            <>
              <p>
                Olá, <span className={styles.nomeUser}> {usuario.nome}</span>
              </p>
              <button
                onClick={logout}
                title="Sair"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiLogOut size={20} color="#1f2937" />
              </button>
            </>
          ) : (
            <Link href="/pages/login">Entrar</Link>
          )}
        </div>

        {/* Botão hamburger para mobile */}
        <div 
          className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMobileMenu}
          role="button"
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </div>
      </header>

      {/* Menu mobile */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileNavLinks}>
          <Link 
            href="/" 
            className={pathname === "/" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Início
          </Link>
          <Link
            href="/pages/localizar"
            className={pathname === "/pages/localizar" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Localizar
          </Link>
          <Link
            href="/pages/calendario"
            className={pathname === "/pages/calendario" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Calendário
          </Link>
          <Link
            href="/pages/assinatura"
            className={pathname === "/pages/assinatura" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Assinatura
          </Link>
          <Link
            href="/pages/sobre"
            className={pathname === "/pages/sobre" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Sobre
          </Link>
        </div>
        
        <div className={styles.mobileAuthLinks}>
          {usuario ? (
            <>
              <p>
                Olá, <span className={styles.nomeUser}> {usuario.nome}</span>
              </p>
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                title="Sair"
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1.1rem",
                  color: "#1f2937",
                  fontWeight: "700"
                }}
              >
                <FiLogOut size={20} />
                Sair
              </button>
            </>
          ) : (
            <Link href="/pages/login" onClick={closeMobileMenu}>
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* Overlay para fechar menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className={`${styles.mobileMenuOverlay} ${styles.active}`}
          onClick={closeMobileMenu}
          role="button"
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}