import React, { useEffect, useState } from "react";
import { useServerId } from "../../contexts/ServerIdContext";
import "./ServerIndicator.css";

export default function ServerIndicator() {
  const { currentServerId, getServerNumber } = useServerId();
  const [isVisible, setIsVisible] = useState(true);
  const [justChanged, setJustChanged] = useState(false);
  const serverNumber = getServerNumber();

  useEffect(() => {
    if (currentServerId) {
      setIsVisible(true);
      // Animação quando muda de servidor
      setJustChanged(true);
      const timer = setTimeout(() => setJustChanged(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentServerId]);

  // Muda a cor de fundo da página baseado no servidor (mais visível)
  useEffect(() => {
    if (serverNumber) {
      const root = document.documentElement;
      const serverColors = {
        1: {
          bg: "rgba(102, 126, 234, 0.08)", // Azul mais visível
          border: "rgba(102, 126, 234, 0.3)",
          topBorder: "#667eea",
          glow: "rgba(102, 126, 234, 0.2)",
        },
        2: {
          bg: "rgba(245, 87, 108, 0.08)", // Rosa mais visível
          border: "rgba(245, 87, 108, 0.3)",
          topBorder: "#f5576c",
          glow: "rgba(245, 87, 108, 0.2)",
        },
      };

      const colors = serverColors[serverNumber] || serverColors[1];
      
      // Aplica estilos globais mais visíveis
      root.style.setProperty("--server-bg-color", colors.bg);
      root.style.setProperty("--server-border-color", colors.border);
      root.style.setProperty("--server-top-border", colors.topBorder);
      root.style.setProperty("--server-glow", colors.glow);
      
      // Adiciona classe ao body e html
      document.body.classList.add(`server-${serverNumber}`);
      document.documentElement.classList.add(`server-${serverNumber}`);
      
      // Adiciona borda colorida no topo da página
      if (!document.getElementById('server-top-indicator')) {
        const indicator = document.createElement('div');
        indicator.id = 'server-top-indicator';
        indicator.className = 'server-top-indicator';
        document.body.appendChild(indicator);
      }
      const topIndicator = document.getElementById('server-top-indicator');
      if (topIndicator) {
        topIndicator.style.backgroundColor = colors.topBorder;
        topIndicator.style.boxShadow = `0 2px 10px ${colors.glow}`;
      }
      
      return () => {
        document.body.classList.remove(`server-${serverNumber}`);
        document.documentElement.classList.remove(`server-${serverNumber}`);
      };
    }
  }, [serverNumber]);

  if (!currentServerId || !serverNumber) {
    return null;
  }

  // Cores diferentes para cada servidor
  const serverColors = {
    1: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "#ffffff",
      border: "#667eea",
    },
    2: {
      bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      text: "#ffffff",
      border: "#f5576c",
    },
  };

  const colors = serverColors[serverNumber] || serverColors[1];

  return (
    <>
      <div
        className={`server-indicator ${isVisible ? "visible" : ""} ${justChanged ? "just-changed" : ""}`}
        style={{
          background: colors.bg,
          color: colors.text,
          borderColor: colors.border,
        }}
      >
        <div className="server-indicator-content">
          <span className="server-indicator-icon">🖥️</span>
          <span className="server-indicator-text">
            Servidor {serverNumber}
          </span>
          {justChanged && <span className="server-indicator-pulse">✨</span>}
        </div>
      </div>
    </>
  );
}

