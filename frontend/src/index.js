import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App';
import Cart from "./pages/cartScreen/Cart";
import Checkout from "./pages/checkoutScreen/Checkout";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);