'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { cadastrarUsuario } from './useCadstro'; 

export  default function Page() {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const dados = Object.fromEntries(formData.entries());

        if (dados.senha !== dados.confirmarSenha) {
            window.alert("As senhas não coincidem.");
            return;
        }

        try {
            await cadastrarUsuario({
                nome: dados.nome as string,
                email: dados.email as string,
                senha: dados.senha as string,
                cpf: dados.cpf as string,
                endereco: dados.endereco as string,
                cep_usuario: dados.cep_usuario as string,
            });
            if (window.confirm("Cadastro realizado com sucesso!")) {
                router.push('/');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                window.alert("Erro ao cadastrar: " + error.message);
            } else {
                window.alert("Erro ao cadastrar.");
            }
        }
    };

    return (
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-2">
                <div>
                    <label htmlFor="nome">Nome completo</label>
                    <input id="nome" name="nome" type="text" required />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required />
                </div>
                <div>
                    <label htmlFor="cpf">CPF</label>
                    <input id="cpf" name="cpf" type="text" maxLength={11} required />
                </div>
                <div>
                    <label htmlFor="endereco">Endereço</label>
                    <input id="endereco" name="endereco" type="text" />
                </div>
                <div>
                    <label htmlFor="cep_usuario">CEP</label>
                    <input id="cep_usuario" name="cep_usuario" type="text" />
                </div>
                <div>
                    <label htmlFor="senha">Senha</label>
                    <input id="senha" name="senha" type="password" required />
                </div>
                <div>
                    <label htmlFor="confirmarSenha">Confirmar senha</label>
                    <input id="confirmarSenha" name="confirmarSenha" type="password" required />
                </div>
            </div>

            <button type="submit">Cadastrar</button>
        </form>
    );
}
