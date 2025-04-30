import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/index';
import Application from '../pages/CakeOrder/Application';
import Carambolos from '../pages/Carambolos';
import FornadaSemana from '../pages/Fornada';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pedido-bolo" element={<Application />} />
        <Route path="/carambolos" element={<Carambolos/>} />
        <Route path="/fornada" element={<FornadaSemana/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;