import React, { useEffect, useState } from "react";
import { useServerId } from "../../contexts/ServerIdContext";
import "./ServerIndicator.css";

export default function ServerIndicator() {
  const { currentServerId, getServerNumber } = useServerId();
  const [isVisible, setIsVisible] = useState(false);
  const serverNumber = getServerNumber();

  useEffect(() => {
    if (currentServerId) {
      setIsVisible(true);
      // Esconde após 5 segundos se não houver mudança
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentServerId]);

  // Muda a cor de fundo da página baseado no servidor
  useEffect(() => {
    if (serverNumber) {
      const root = document.documentElement;
      const serverColors = {
        1: {
          bg: "rgba(102, 126, 234, 0.05)", // Azul suave
          border: "rgba(102, 126, 234, 0.1)",
        },
        2: {
          bg: "rgba(245, 87, 108, 0.05)", // Rosa suave
          border: "rgba(245, 87, 108, 0.1)",
        },
      };

      const colors = serverColors[serverNumber] || serverColors[1];
      
      // Adiciona uma classe ao body para mudança de cor sutil
      document.body.style.setProperty("--server-bg-color", colors.bg);
      document.body.style.setProperty("--server-border-color", colors.border);
      document.body.classList.add(`server-${serverNumber}`);
      
      return () => {
        document.body.classList.remove(`server-${serverNumber}`);
        document.body.style.removeProperty("--server-bg-color");
        document.body.style.removeProperty("--server-border-color");
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
    <div
      className={`server-indicator ${isVisible ? "visible" : ""}`}
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
        <span className="server-indicator-id">({currentServerId})</span>
      </div>
    </div>
  );
}
