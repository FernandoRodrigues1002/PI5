'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/auth';
import { useAuth } from '@/app/components/hooks/useAuth';

export const useLogin = () => {
  const router = useRouter();
  const { setUsuario } = useAuth();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    show: false,
    success: false,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultado = await authService.login(formData.email, formData.senha);
      localStorage.setItem('user', JSON.stringify(resultado.user));
      localStorage.setItem('token', resultado.token);

      setUsuario(resultado.user); // atualiza o contexto

      setModalInfo({
        show: true,
        success: true,
        message: 'Login realizado com sucesso!',
      });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      setModalInfo({
        show: true,
        success: false,
        message: 'Email ou senha incorretos. Tente novamente.',
      });
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, modalInfo, setModalInfo };
};
