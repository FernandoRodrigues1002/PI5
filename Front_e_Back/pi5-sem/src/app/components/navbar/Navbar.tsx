'use client';

import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";  // ajuste o caminho
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  return (
    <header className={styles.navbar}>
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
        <Link href="/" className={pathname === "/" ? "active" : ""}>Início</Link>
        <Link href="/pages/localizar" className={pathname === "/pages/localizar" ? "active" : ""}>Localizar</Link>
        <Link href="/pages/calendario" className={pathname === "/pages/calendario" ? "active" : ""}>Calendário</Link>
        <Link href="/pages/assinatura" className={pathname === "/pages/assinatura" ? "active" : ""}>Assinatura</Link>
      </nav>

      <div className={styles.authLinks}>
        {usuario ? (
          <>
            <span className={styles.nomeUser}>{usuario.nome}</span>
            <button
              onClick={logout}
              title="Sair"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <FiLogOut size={20} color="#1f2937" />
            </button>
          </>
        ) : (
          <Link href="/pages/login">Entrar</Link>
        )}
      </div>
    </header>
  );
}
