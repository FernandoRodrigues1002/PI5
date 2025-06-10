'use client';

import Link from 'next/link';
import styles from './Login.module.css';
import { useLogin } from './useLogin';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ModalMessage from '../../components/modal/ModalMessage';

export default function LoginPage() {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    modalInfo,
    setModalInfo
  } = useLogin();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.cardLogin}>
        <div className={styles.box}>
          <h2 className={styles.title}>Entre na sua conta</h2>
          <p className="text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/pages/cadastro" className={styles.link}>
              cadastre-se agora
            </Link>
          </p>

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

              <div className={styles.passwordContainer}>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  name="senha"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className={styles.eyeButton}
                  aria-label="Mostrar ou ocultar senha"
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className={styles.rememberContainer}>
              <a href="#" className={styles.link}>
                Esqueceu sua senha?
              </a>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Mensagem */}
      <ModalMessage
        show={modalInfo.show}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
        success={modalInfo.success}
        message={modalInfo.message}
      />
    </div>
  );
}
