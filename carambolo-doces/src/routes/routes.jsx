import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/index';
import UserPage from '../pages/UserPage/index';
import AddressPage from '../pages/AddressPage/index';
import Application from '../pages/CakeOrder/Application';
import Carambolos from '../pages/Carambolos';
import FornadaSemana from '../pages/Fornada';
import FornadaOrderPage from '../pages/FornadaOrderPage';
import FornadaDashboard from '../pages/FornadaDashboard';
import Products from '../pages/Products/index';
import OrderKanban from '../pages/OrderKanban/index';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import AllFornadasDashboard from '../pages/AllFornadasDashboard/AllFornadasDashboard';
import ModalCadastroProduto from '../components/ModalCadastroProduto';
import Products from '../pages/Products/index';
import OrderKanban from '../pages/OrderKanban/index';
import CartPage from '../pages/Cart';
import FornadaMultiOrderPage from '../pages/FornadaOrderPage/Multi';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/pagina-usuario"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pagina-enderecos"
        element={
          <ProtectedRoute>
            <AddressPage />
          </ProtectedRoute>
        }
      />
      <Route path="/pedido-bolo" element={<Application />} />
      <Route path="/carambolos" element={<Carambolos />} />
      <Route path="/fornada" element={<FornadaSemana />} />
      <Route path="/pedido-fornada" element={<FornadaOrderPage />} />
      <Route
        path="/dashboard-kanban-pedidos"
        element={
          <ProtectedRoute requireAdmin={true}>
            <OrderKanban />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtos"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fornada-dashboard"
        element={
          <ProtectedRoute requireAdmin={true}>
            <FornadaDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;