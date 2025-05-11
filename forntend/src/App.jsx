import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import './styles/Auth.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import About from './pages/About';
import Stories from './pages/Stories';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Dashboard from './pages/Dashboard';
import Men from './pages/Men';
import Women from './pages/Women';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminProducts from './pages/AdminProducts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// AppContent component to use useLocation hook
const AppContent = () => {
  const location = useLocation();

  // Function to check if the current path is an admin path
  const isAdminPath = () => {
    return location.pathname.startsWith('/admin/login') ||
           location.pathname.startsWith('/admin/signup');
  };

  return (
    <div className="app">
      {/* Conditionally render Navbar based on path */}
      {!isAdminPath() && <Navbar />}

      <main className={isAdminPath() ? "admin-main-content" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
      </main>

      {/* Conditionally render Footer based on path */}
      {!isAdminPath() && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

