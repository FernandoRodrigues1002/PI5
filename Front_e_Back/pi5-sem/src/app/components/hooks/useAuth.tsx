"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Usuario {
  nome: string;
  premium?: boolean;
  cpf: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  logout: () => void;
  login: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  // Atualiza localStorage sempre que o usuário mudar
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("user", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("user");
    }
  }, [usuario]);

  const login = (usuario: Usuario) => {
    setUsuario(usuario);
    // token pode ser salvo aqui se usado
    localStorage.setItem("user", JSON.stringify(usuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
