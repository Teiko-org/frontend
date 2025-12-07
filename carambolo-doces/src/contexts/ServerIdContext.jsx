import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const ServerIdContext = createContext(null);

export function ServerIdProvider({ children }) {
  const [currentServerId, setCurrentServerId] = useState(null);
  const [serverHistory, setServerHistory] = useState([]);

  const updateServerId = useCallback((serverId) => {
    if (serverId && serverId !== currentServerId) {
      setCurrentServerId(serverId);
      setServerHistory((prev) => {
        const newHistory = [...prev, { serverId, timestamp: new Date() }];
        // Manter apenas os últimos 10 registros
        return newHistory.slice(-10);
      });
    }
  }, [currentServerId]);

  // Listener para eventos customizados do interceptor do Axios
  useEffect(() => {
    const handleServerIdUpdate = (event) => {
      updateServerId(event.detail);
    };

    window.addEventListener('serverIdUpdate', handleServerIdUpdate);
    return () => {
      window.removeEventListener('serverIdUpdate', handleServerIdUpdate);
    };
  }, [updateServerId]);

  const getServerNumber = useCallback(() => {
    if (!currentServerId) return null;
    // Extrai número do servidor (ex: "server-1", "server-2", ou hostname)
    const match = currentServerId.match(/server[_-]?(\d+)/i);
    if (match) {
      return parseInt(match[1]);
    }
    // Se não encontrar número, usa hash do ID para gerar um número consistente
    let hash = 0;
    for (let i = 0; i < currentServerId.length; i++) {
      hash = ((hash << 5) - hash) + currentServerId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 2) + 1; // Retorna 1 ou 2
  }, [currentServerId]);

  const value = {
    currentServerId,
    serverHistory,
    updateServerId,
    getServerNumber,
  };

  return <ServerIdContext.Provider value={value}>{children}</ServerIdContext.Provider>;
}

export function useServerId() {
  const ctx = useContext(ServerIdContext);
  if (!ctx) {
    throw new Error("useServerId deve ser usado dentro de ServerIdProvider");
  }
  return ctx;
}

