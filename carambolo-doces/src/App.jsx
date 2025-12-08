import React from "react";
import "./App.css";
import AppRoutes from "./routes/routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./contexts/CartContext";
import { ServerIdProvider } from "./contexts/ServerIdContext";
import ServerIndicator from "./components/ServerIndicator";

// CSS para garantir que os toasts apareçam acima de modais
const toastStyles = `
  .Toastify__toast-container {
    z-index: 99999 !important;
    position: fixed !important;
  }
  .Toastify__toast {
    z-index: 99999 !important;
    position: relative !important;
  }
  .Toastify__toast-container--top-right {
    top: 1em !important;
    right: 1em !important;
  }
  .Toastify__toast--success {
    background: #10B981 !important;
    color: white !important;
  }
  .Toastify__toast--error {
    background: #EF4444 !important;
    color: white !important;
  }
  .Toastify__toast {
    animation: Toastify__slideInRight 0.3s ease-out, Toastify__slideOutRight 0.3s ease-in !important;
  }
  .Toastify__toast--rtl {
    animation: Toastify__slideInLeft 0.3s ease-out, Toastify__slideOutLeft 0.3s ease-in !important;
  }
  .Toastify__toast-body {
    margin: auto 0;
    flex: 1 1 auto;
  }
  .Toastify__close-button {
    color: #fff;
    opacity: 0.7;
    cursor: pointer;
  }
  .Toastify__close-button:hover {
    opacity: 1;
  }
  .toast-custom {
    animation: Toastify__slideInRight 0.3s ease-out !important;
  }
  .toast-custom[data-state="exiting"] {
    animation: Toastify__slideOutRight 0.3s ease-in !important;
  }
  .Toastify__toast--success,
  .Toastify__toast--error,
  .Toastify__toast--info,
  .Toastify__toast--warning {
    animation-fill-mode: forwards !important;
  }
  .Toastify__toast-container--top-right .Toastify__toast {
    pointer-events: auto !important;
  }
  .Toastify__toast-container--top-right .Toastify__toast:hover {
    animation-play-state: paused !important;
  }
  .Toastify__progress-bar {
    background: rgba(255, 255, 255, 0.9) !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: 4px !important;
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    z-index: 9999 !important;
  }
  .Toastify__progress-bar--animated {
    animation: Toastify__progress-bar-animation 15s linear forwards !important;
  }
  @keyframes Toastify__progress-bar-animation {
    0% {
      transform: scaleX(1);
    }
    100% {
      transform: scaleX(0);
    }
  }
  .Toastify__toast--rtl .Toastify__progress-bar {
    right: 0 !important;
    left: auto !important;
    transform-origin: right !important;
  }
  .Toastify__toast {
    position: relative !important;
    overflow: hidden !important;
  }
  /* Garantir que todos os toasts tenham autoClose */
  .Toastify__toast {
    --toastify-toast-autoclose: 15000ms !important;
  }
  .Toastify__toast[data-autoclose="false"] {
    --toastify-toast-autoclose: 15000ms !important;
  }
`;

// Adicionar estilos ao head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = toastStyles;
  style.id = 'toast-custom-styles';
  // Remove estilo anterior se existir
  const existingStyle = document.getElementById('toast-custom-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  document.head.appendChild(style);
}

function App() {
  return (
    <BrowserRouter>
      <ServerIdProvider>
      <CartProvider>
        <ScrollToTop />
          <ServerIndicator />
        <AppRoutes />
      </CartProvider>
      </ServerIdProvider>
      <ToastContainer
        position="top-right"
        autoClose={15000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={true}
        theme="colored"
        enableMultiContainer={false}
        limit={5}
        closeButton={true}
        style={{
          zIndex: 99999
        }}
      />
    </BrowserRouter>
  );
}

export default App;