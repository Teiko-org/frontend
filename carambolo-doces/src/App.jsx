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
`;

// Adicionar estilos ao head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = toastStyles;
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
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        enableMultiContainer={false}
        limit={3}
      />
    </BrowserRouter>
  );
}

export default App;