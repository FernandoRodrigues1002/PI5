'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';

import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return authService.isAuthenticated() ? children : null;
}