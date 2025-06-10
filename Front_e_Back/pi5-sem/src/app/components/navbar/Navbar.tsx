"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { FiLogOut, FiBell, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

interface Notificacao {
  id: number;
  mensagem: string;
  vista: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    { id: 1, mensagem: "Sua consulta foi confirmada.", vista: false },
    { id: 2, mensagem: "Novo conteúdo disponível para Premiums.", vista: false },
  ]);
  const [dropdownNotifsOpen, setDropdownNotifsOpen] = useState(false);
  const [dropdownUserOpen, setDropdownUserOpen] = useState(false);
  const [showCpf, setShowCpf] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownUserOpen(false);
        setDropdownNotifsOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    // Fecha dropdowns ao login/logout
    setDropdownUserOpen(false);
    setDropdownNotifsOpen(false);
  }, [usuario]);

  const notificacoesNaoVistas = notificacoes.filter(n => !n.vista).length;

  const cpfMascarado = usuario?.cpf
    ? usuario.cpf.replace(/\d(?=\d{4})/g, "*")
    : "";

  const toggleShowCpf = () => setShowCpf(prev => !prev);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.logoArea}>
          <Link href="/" onClick={() => setDropdownUserOpen(false)}>
            <p className={styles.logoText}>
              <span className={styles.logoMed}>Med</span>Locator
            </p>
          </Link>
        </div>

        <nav className={styles.navLinks}>
          <Link href="/" className={pathname === "/" ? "active" : ""}>Início</Link>
          <Link href="/pages/localizar" className={pathname === "/pages/localizar" ? "active" : ""}>Localizar</Link>
          <Link href="/pages/calendario" className={pathname === "/pages/calendario" ? "active" : ""}>Calendário</Link>
          {usuario?.premium ? (
            <Link href="/pages/controles" className={pathname === "/pages/controles" ? "active" : ""}>Controles Premium</Link>
          ) : (
            <Link href="/pages/assinatura" className={pathname === "/pages/assinatura" ? "active" : ""}>Assinatura</Link>
          )}
          <Link href="/pages/sobre" className={pathname === "/pages/sobre" ? "active" : ""}>Sobre</Link>
        </nav>

        <div className={styles.authLinks}>
          {usuario ? (
            <>
              {/* Notificações */}
              {usuario.premium && (
                <div className={styles.notificacaoDropdown}>
                  <div
                    className={styles.notificacaoIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownNotifsOpen(o => !o);
                    }}
                  >
                    <FiBell size={22} />
                    {notificacoesNaoVistas > 0 && (
                      <span className={styles.notificacaoBadge}>
                        {notificacoesNaoVistas}
                      </span>
                    )}
                  </div>
                  {dropdownNotifsOpen && (
                    <div className={styles.notificacaoLista}>
                      {notificacoes.map(n => (
                        <p
                          key={n.id}
                          className={styles.notificacaoItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotificacoes(prev =>
                              prev.map(item =>
                                item.id === n.id
                                  ? { ...item, vista: true }
                                  : item
                              )
                            );
                          }}
                        >
                          {n.mensagem}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Usuário */}
              <div className={styles.userDropdown} ref={userDropdownRef}>
                <div
                  className={styles.userIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownUserOpen(o => !o);
                  }}
                >
                  <FiUser size={24} />
                </div>
                {dropdownUserOpen && (
                  <div className={styles.userDropdownMenu}>
                    <div className={styles.userInfo}>
                      <h4>{usuario.nome}</h4>
                      <p>
                        Assinatura:{" "}
                        <span
                          style={{
                            color: usuario.premium ? "gold" : "#2563eb",
                            fontWeight: "bold"
                          }}
                        >
                          {usuario.premium ? "Premium" : "Padrão"}
                        </span>
                      </p>

                      <p className={styles.cpfLine}>
                        CPF:{" "}
                        {showCpf ? usuario.cpf : cpfMascarado}{" "}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShowCpf();
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                          }}
                          title={showCpf ? "Ocultar CPF" : "Mostrar CPF"}
                        >
                          {showCpf ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className={styles.logoutButton}
                    >
                      <FiLogOut /> Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/pages/login">Entrar</Link>
          )}
        </div>

        <div
          className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.active : ""}`}
          onClick={() => setIsMobileMenuOpen(o => !o)}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </div>
      </header>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileNavLinks}>
            <Link href="/" className={pathname === "/" ? "active" : ""}>Início</Link>
            <Link href="/pages/localizar" className={pathname === "/pages/localizar" ? "active" : ""}>Localizar</Link>
            <Link href="/pages/calendario" className={pathname === "/pages/calendario" ? "active" : ""}>Calendário</Link>
            {usuario?.premium ? (
              <Link href="/pages/controles" className={pathname === "/pages/controles" ? "active" : ""}>Controles Premium</Link>
            ) : (
              <Link href="/pages/assinatura" className={pathname === "/pages/assinatura" ? "active" : ""}>Assinatura</Link>
            )}
            <Link href="/pages/sobre" className={pathname === "/pages/sobre" ? "active" : ""}>Sobre</Link>
          </div>

          {usuario ? (
            <div className={styles.mobileAuthLinks}>
              <div className={styles.mobileUserBox}>
                <p><strong>{usuario.nome}</strong></p>
                <p>Assinatura: {usuario.premium ? "Premium" : "Padrão"}</p>
              </div>
              <button className={styles.logoutButton} onClick={logout}>
                <FiLogOut /> Sair
              </button>
            </div>
          ) : (
            <div className={styles.mobileAuthLinks}>
              <Link href="/pages/login">Entrar</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
