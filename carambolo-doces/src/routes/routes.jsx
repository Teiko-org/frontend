import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/index';
import UserPage from '../pages/UserPage/index';
import AddressPage from '../pages/AddressPage/index';
import Application from '../pages/CakeOrder/Application';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pagina-usuario" element={<UserPage />} />
        <Route path="/pagina-enderecos" element={<AddressPage />} />
        <Route path="/pedido-bolo" element={<Application />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;