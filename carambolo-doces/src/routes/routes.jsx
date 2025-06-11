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
import Products from '../pages/Products/index'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pagina-usuario" element={<UserPage />} />
      <Route path="/pagina-enderecos" element={<AddressPage />} />
      <Route path="/pedido-bolo" element={<Application />} />
      <Route path="/carambolos" element={<Carambolos/>} />
      <Route path="/fornada" element={<FornadaSemana/>} />
      <Route path="/pedido-fornada" element={<FornadaOrderPage/>} />
      <Route path="/produtos" element={<Products />} />
    </Routes>
  );
};

export default AppRoutes;