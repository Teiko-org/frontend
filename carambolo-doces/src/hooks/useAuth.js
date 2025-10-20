import { useState, useEffect } from 'react';
import { validateAndCleanAuth, clearAuthData } from '../service/userService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isValid = validateAndCleanAuth();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        clearAuthData();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Verificar autenticação na inicialização
    checkAuth();

    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    logout
  };
};
