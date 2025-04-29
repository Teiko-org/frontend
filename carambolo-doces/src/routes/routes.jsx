import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/index';
import Application from '../pages/CakeOrder/Application';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pedido-bolo" element={<Application />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;