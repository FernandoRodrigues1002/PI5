'use client';

import Link from 'next/link';
import styles from './Login.module.css';
import { useLogin } from './useLogin';

export default function LoginPage() {
  const { formData, handleChange, handleSubmit, erro, loading } = useLogin();

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Entre na sua conta</h2>
        <p className="text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/pages/cadastro" className={styles.link}>cadastre-se agora</Link>
        </p>

        {erro && <div className={styles.error}>{erro}</div>}

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.rememberContainer}>
            <a href="#" className={styles.link}>Esqueceu sua senha?</a>
          </div>

          <button type="submit" className={styles.button} disabled={loading}> {loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  );
}
