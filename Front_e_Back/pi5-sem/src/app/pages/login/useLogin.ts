'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/auth';

export const useLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const resultado = await authService.login(formData.email, formData.senha);
      localStorage.setItem('user', JSON.stringify(resultado.user));
      localStorage.setItem('token', resultado.token);

      // ✅ Alerta de sucesso e redirecionamento para a home
      alert('Login realizado com sucesso!');
      router.push('/');
    } catch (error) {
      // ✅ Mensagem visível no formulário
      setErro('Email ou senha incorretos. Tente novamente.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, erro, loading };
};
