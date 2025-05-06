const API_URL = 'http://localhost:5000'; // URL do servidor Flask

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = (data && data.erro) || response.statusText;
    return Promise.reject(error);
  }
  
  return data;
};

export const authService = {
  // Login de usuário
  login: async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Erro na API de login:', error);
      throw new Error('Falha na autenticação');
    }
  },

  // Registro de novo usuário
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Erro na API de registro:', error);
      if (error.toString().includes('Email já cadastrado')) {
        throw new Error('Este email já está cadastrado');
      }
      throw new Error('Falha ao registrar usuário');
    }
  },

  // Logout do usuário
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Verificar se usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  // Obter token de autenticação
  getToken: () => {
    return localStorage.getItem('token');
  }
};