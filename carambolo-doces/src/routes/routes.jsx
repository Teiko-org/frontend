import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/index';
import UserPage from '../pages/UserPage/index';
import AddressPage from '../pages/AddressPage/index';
import Application from '../pages/CakeOrder/Application';
import Carambolos from '../pages/Carambolos';
import FornadaSemana from '../pages/Fornada';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pagina-usuario" element={<UserPage />} />
        <Route path="/pagina-enderecos" element={<AddressPage />} />
        <Route path="/pedido-bolo" element={<Application />} />
        <Route path="/carambolos" element={<Carambolos/>} />
        <Route path="/fornada" element={<FornadaSemana/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;