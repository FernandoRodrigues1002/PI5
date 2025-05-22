"use client";

import Link from "next/link";
import styles from "@/styles/navbar.module.css";
import Image from "next/image";

export default function Navbar() {
    return (
        <header className={styles.navbar}>
            <div className={styles.logoArea}>
                <Link href="/"><span className={styles.logoText}>
                    <Image
                        src="/images/logo.png"
                        alt="MedLocator Logo"
                        width={100}
                        height={100}
                        style={{ width: "50px", height: "50px"}}
                    />
                </span></Link>
            </div>
            <nav className={styles.navLinks}>
                <Link href="/suporte">Suporte</Link>
                <Link href="/localiza">Localiza</Link>
                <Link href="/pages/login">Entrar</Link>
            </nav>
        </header>
    );
}
