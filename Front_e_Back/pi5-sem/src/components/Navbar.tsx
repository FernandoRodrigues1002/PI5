"use client";

import Link from "next/link";
import styles from "@/styles/navbar.module.css";

export default function Navbar() {
    return (
        <header className={styles.navbar}>
            <div className={styles.logoArea}>
                 <Link href="/"><span className={styles.logoText}>MedLocator</span></Link>
            </div>
            <nav className={styles.navLinks}>
                <Link href="/suporte">Suporte</Link>
                <Link href="/localiza">Localiza</Link>
                <Link href="/pages/login">Entrar</Link>
            </nav>
        </header>
    );
}
