import React from "react";
import "./App.css";
import AppRoutes from "./routes/routes";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./contexts/CartContext";
import { ServerIdProvider } from "./contexts/ServerIdContext";
import ServerIndicator from "./components/ServerIndicator";

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
    </BrowserRouter>
  );
}

export default App;