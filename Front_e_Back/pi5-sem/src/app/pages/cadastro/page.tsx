"use client";

import React, { useState, useEffect } from "react";
import styles from "./cadastro.module.css";
import { useRouter } from "next/navigation";
import { cadastrarUsuario } from "./useCadstro";
import Link from "next/link";
import Footer from "../../components/footer/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalMessage from "../../components/modal/ModalMessage";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Page() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    endereco: "",
    cep_usuario: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    success: false,
    message: "",
  });
  const [isProcessing, setIsProcessing] = useState(false); // NOVO: estado para loading

  // requisitos de senha
  const [passwordRequisitos, setPasswordRequisitos] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    const senha = formData.senha;
    setPasswordRequisitos({
      minLength: senha.length >= 8,
      hasUppercase: /[A-Z]/.test(senha),
      hasLowercase: /[a-z]/.test(senha),
      hasNumber: /[0-9]/.test(senha),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
    });
  }, [formData.senha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email é obrigatório.";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email inválido.";

      if (!formData.senha) newErrors.senha = "Senha é obrigatória.";
      else if (Object.values(passwordRequisitos).includes(false))
        newErrors.senha = "Senha não atende aos requisitos.";

      if (formData.senha !== formData.confirmarSenha)
        newErrors.confirmarSenha = "Senhas não coincidem.";
    }

    if (step === 2) {
      if (!formData.nome) newErrors.nome = "Nome é obrigatório.";
      if (!formData.cpf) newErrors.cpf = "CPF é obrigatório.";
      else if (!/^\d{11}$/.test(formData.cpf))
        newErrors.cpf = "CPF deve ter 11 números.";
    }

    if (step === 3) {
      if (!formData.endereco) newErrors.endereco = "Endereço é obrigatório.";
      if (!formData.cep_usuario) newErrors.cep_usuario = "CEP é obrigatório.";
      else if (formData.cep_usuario.length < 8)
        newErrors.cep_usuario = "CEP inválido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setIsProcessing(true); // mostra o loading
      try {
        await cadastrarUsuario({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          cpf: formData.cpf,
          endereco: formData.endereco,
          cep_usuario: formData.cep_usuario,
        });
        setModalInfo({
          show: true,
          success: true,
          message: "Cadastro realizado com sucesso!",
        });
        setTimeout(() => router.push("/"), 2000);
      } catch (error: unknown) {
        setModalInfo({
          show: true,
          success: false,
          message:
            error instanceof Error
              ? "Erro ao cadastrar: " + error.message
              : "Erro ao cadastrar.",
        });
      } finally {
        setIsProcessing(false); // esconde o loading
      }
    }
  };

  const progressPercent = (step / 3) * 100;

  return (
    <>
      <div className={styles.medicalBg}>
        <div className={styles.formContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className={styles.formHeader}>
            <h1>Cadastro de Usuário</h1>
            <p>Etapa {step} de 3</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className={styles.formField}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <span className={styles.error}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.formField}>
                  <label>Senha</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className={styles.eyeButton}
                    >
                      {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.senha && (
                    <span className={styles.error}>{errors.senha}</span>
                  )}

                  <div className={styles.passwordRequisitos}>
                    <p>Requisitos da senha:</p>
                    <ul>
                      <li
                        className={
                          passwordRequisitos.minLength
                            ? styles.valido
                            : styles.invalido
                        }
                      >
                        Mínimo 8 caracteres
                      </li>
                      <li
                        className={
                          passwordRequisitos.hasUppercase
                            ? styles.valido
                            : styles.invalido
                        }
                      >
                        Pelo menos uma letra maiúscula
                      </li>
                      <li
                        className={
                          passwordRequisitos.hasLowercase
                            ? styles.valido
                            : styles.invalido
                        }
                      >
                        Pelo menos uma letra minúscula
                      </li>
                      <li
                        className={
                          passwordRequisitos.hasNumber
                            ? styles.valido
                            : styles.invalido
                        }
                      >
                        Pelo menos um número
                      </li>
                      <li
                        className={
                          passwordRequisitos.hasSpecialChar
                            ? styles.valido
                            : styles.invalido
                        }
                      >
                        Pelo menos um caractere especial
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Confirmar Senha</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={mostrarConfirmarSenha ? "text" : "password"}
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                      }
                      className={styles.eyeButton}
                    >
                      {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <span className={styles.error}>{errors.confirmarSenha}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className={styles.submitButton}
                >
                  Próximo
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className={styles.formField}>
                  <label>Nome completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                  {errors.nome && (
                    <span className={styles.error}>{errors.nome}</span>
                  )}
                </div>

                <div className={styles.formField}>
                  <label>CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    maxLength={11}
                    required
                  />
                  {errors.cpf && (
                    <span className={styles.error}>{errors.cpf}</span>
                  )}
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={prevStep}
                    className={styles.submitButton}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className={styles.submitButton}
                  >
                    Próximo
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className={styles.formField}>
                  <label>Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                  />
                  {errors.endereco && (
                    <span className={styles.error}>{errors.endereco}</span>
                  )}
                </div>

                <div className={styles.formField}>
                  <label>CEP</label>
                  <input
                    type="text"
                    name="cep_usuario"
                    value={formData.cep_usuario}
                    onChange={handleChange}
                    required
                  />
                  {errors.cep_usuario && (
                    <span className={styles.error}>{errors.cep_usuario}</span>
                  )}
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={prevStep}
                    className={styles.submitButton}
                  >
                    Voltar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Cadastrar
                  </button>
                </div>
              </>
            )}
          </form>

          <div className={styles.linkArea}>
            Já tem cadastro? <Link className={styles.link} href="/pages/login">Faça login aqui</Link>
          </div>
        </div>
      </div>

      {/* Overlay de processamento */}
      {isProcessing && (
        <div className={styles.processingOverlay}>
          <AiOutlineLoading3Quarters className={styles.spinner} />
          <p>Processando cadastro...</p>
        </div>
      )}

      <ModalMessage
        show={modalInfo.show}
        success={modalInfo.success}
        message={modalInfo.message}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
      />
      <Footer />
    </>
  );
}
