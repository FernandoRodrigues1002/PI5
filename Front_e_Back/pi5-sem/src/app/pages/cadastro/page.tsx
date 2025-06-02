"use client";

import React, { useState } from "react";
import styles from "./cadastro.module.css";
import { useRouter } from "next/navigation";
import { cadastrarUsuario } from "./useCadstro";
import Link from "next/link";
import { useEffect } from 'react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email é obrigatório.";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";

      if (!formData.senha) newErrors.senha = "Senha é obrigatória.";
      else if (formData.senha.length < 6) newErrors.senha = "Senha deve ter ao menos 6 caracteres.";

      if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = "Senhas não coincidem.";
    }

    if (step === 2) {
      if (!formData.nome) newErrors.nome = "Nome é obrigatório.";
      if (!formData.cpf) newErrors.cpf = "CPF é obrigatório.";
      else if (!/^\d{11}$/.test(formData.cpf)) newErrors.cpf = "CPF deve ter 11 números.";
    }

    if (step === 3) {
      if (!formData.endereco) newErrors.endereco = "Endereço é obrigatório.";
      if (!formData.cep_usuario) newErrors.cep_usuario = "CEP é obrigatório.";
      else if (formData.cep_usuario.length < 8) newErrors.cep_usuario = "CEP inválido.";
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
      try {
        await cadastrarUsuario({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          cpf: formData.cpf,
          endereco: formData.endereco,
          cep_usuario: formData.cep_usuario,
        });
        if (window.confirm("Cadastro realizado com sucesso!")) {
          router.push("/");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          window.alert("Erro ao cadastrar: " + error.message);
        } else {
          window.alert("Erro ao cadastrar.");
        }
      }
    }
  };

  const progressPercent = (step / 3) * 100;

    useEffect(() => {
  // Quando o componente monta, desabilita o scroll
  document.body.style.overflow = 'hidden';

  // Quando desmonta (navega para outra página), reativa o scroll
  return () => {
    document.body.style.overflow = 'auto';
  };
}, []);

  return (
    <div className={styles.medicalBg}>
      <div className={styles.formContainer}>
        {/* Barra de progresso */}
        <div
          style={{
            height: "8px",
            background: "#ccc",
            borderRadius: "4px",
            marginBottom: "1rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "#0070f3",
              transition: "width 0.3s ease",
            }}
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
                {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
              </div>

              <div className={styles.formField}>
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
                {errors.senha && <span style={{ color: "red" }}>{errors.senha}</span>}
              </div>

              <div className={styles.formField}>
                <label>Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                />
                {errors.confirmarSenha && (
                  <span style={{ color: "red" }}>{errors.confirmarSenha}</span>
                )}
              </div>

              <button type="button" onClick={nextStep} className={styles.submitButton}>
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
                {errors.nome && <span style={{ color: "red" }}>{errors.nome}</span>}
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
                {errors.cpf && <span style={{ color: "red" }}>{errors.cpf}</span>}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" onClick={prevStep} className={styles.submitButton}>
                  Voltar
                </button>
                <button type="button" onClick={nextStep} className={styles.submitButton}>
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
                {errors.endereco && <span style={{ color: "red" }}>{errors.endereco}</span>}
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
                  <span style={{ color: "red" }}>{errors.cep_usuario}</span>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" onClick={prevStep} className={styles.submitButton}>
                  Voltar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Cadastrar
                </button>
              </div>
            </>
          )}
        </form>

        <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
          Já tem cadastro?{" "}
          <Link href="/pages/login" style={{ color: "#0070f3", textDecoration: "underline" }}>
            Faça login aqui!
          </Link>
        </div>
      </div>
    </div>
  );
}
