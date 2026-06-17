import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/homeScreen/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Cart from "./pages/cartScreen/Cart";
import Checkout from "./pages/checkoutScreen/Checkout";
import OrderSuccess from "./pages/checkoutScreen/OrderSuccess";
import OrderTracking from "./pages/orders/OrderTracking";
import Forgot from "./pages/forgot/Forgot";
import About from "./pages/aboutUs/About";
import Learning from "./pages/learning/Learning";
import Novel from "./pages/novel/Novel";
import Business from "./pages/business/Business";
import Health from "./pages/health/Health";
import ProductDetail from "./pages/productDetail/ProductDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/profile/Profile";

import "./App.css";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrderTracking />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/about" element={<About />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/novel" element={<Novel />} />
        <Route path="/business" element={<Business />} />
        <Route path="/health" element={<Health />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;