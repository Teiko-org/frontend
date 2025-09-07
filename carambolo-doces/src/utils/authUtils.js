import { clearAuthData } from '../service/userService';

// Função para limpar todos os dados de autenticação (útil para desenvolvimento)
export const clearAllAuthData = () => {
  console.log("🧹 Limpando todos os dados de autenticação...");
  
  // Limpar dados do localStorage
  localStorage.clear();
  
  // Limpar todos os cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  // Limpar sessionStorage
  sessionStorage.clear();
  
  console.log("✅ Todos os dados de autenticação foram limpos");
  
  // Recarregar a página
  window.location.reload();
};

// Função para verificar o status atual da autenticação
export const checkAuthStatus = () => {
  const isSigned = localStorage.getItem("IS_SIGNED");
  const userId = localStorage.getItem("userId");
  const userData = localStorage.getItem("userData");
  
  console.log("🔍 Status da autenticação:");
  console.log("- IS_SIGNED:", isSigned);
  console.log("- userId:", userId);
  console.log("- userData:", userData ? "Presente" : "Ausente");
  
  // Verificar cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  console.log("- Cookies:", cookies);
  
  return {
    isSigned: isSigned === 'true',
    userId,
    hasUserData: !!userData,
    cookies
  };
};

// Disponibilizar funções globalmente para uso no console do navegador
if (typeof window !== 'undefined') {
  window.clearAllAuthData = clearAllAuthData;
  window.checkAuthStatus = checkAuthStatus;
}
