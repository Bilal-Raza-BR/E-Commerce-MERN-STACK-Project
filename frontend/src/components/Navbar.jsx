import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { totalItems } = useCart();

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // Check on component mount
    checkLoginStatus();

    // Add event listener for storage changes (for when logout happens in another tab)
    window.addEventListener('storage', checkLoginStatus);

    // Create a custom event listener for login/logout
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logging Out',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Log Out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('loginStatusChanged'));

        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/login');
          // Close mobile menu if open
          if (mobileMenuOpen) {
            setMobileMenuOpen(false);
          }
        });
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EVERLANE
        </Link>

        {/* Hamburger Menu Button */}
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-menu">
          <Link to="/women" className="navbar-item">Women</Link>
          <Link to="/men" className="navbar-item">Men</Link>
          <Link to="/about" className="navbar-item">About</Link>
          <Link to="/stories" className="navbar-item">Everlane Stories</Link>
        </div>

        {/* Desktop Icons */}
        <div className="navbar-icons desktop-icons">
          <div className="search-icon">
            <i className="fas fa-search"></i>
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="navbar-icon cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          {/* Auth Links */}
          <div className="auth-links">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="navbar-icon profile-icon">
                  <i className="fas fa-user-circle"></i>
                </Link>
                <button className="auth-link logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">Login</Link>
                <Link to="/signup" className="auth-link signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && <div className="mobile-menu-backdrop" onClick={toggleMobileMenu}></div>}

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-links">
            <Link to="/women" className="mobile-menu-item" onClick={toggleMobileMenu}>Women</Link>
            <Link to="/men" className="mobile-menu-item" onClick={toggleMobileMenu}>Men</Link>
            <Link to="/about" className="mobile-menu-item" onClick={toggleMobileMenu}>About</Link>
            <Link to="/stories" className="mobile-menu-item" onClick={toggleMobileMenu}>Everlane Stories</Link>
            <Link to="/cart" className="mobile-menu-item" onClick={toggleMobileMenu}>
              <i className="fas fa-shopping-cart"></i> Cart {totalItems > 0 && <span className="mobile-cart-count">({totalItems})</span>}
            </Link>
            <div className="mobile-menu-divider"></div>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="mobile-menu-item" onClick={toggleMobileMenu}>
                  <i className="fas fa-user-circle"></i> My Profile
                </Link>
                <Link to="/orders" className="mobile-menu-item" onClick={toggleMobileMenu}>
                  <i className="fas fa-shopping-bag"></i> My Orders
                </Link>
                <button className="mobile-menu-item logout-mobile-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu-item" onClick={toggleMobileMenu}>
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
                <Link to="/signup" className="mobile-menu-item highlight" onClick={toggleMobileMenu}>
                  <i className="fas fa-user-plus"></i> Sign Up
                </Link>
              </>
            )}
            <div className="mobile-search">
              <input type="text" placeholder="Search..." />
              <button><i className="fas fa-search"></i></button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
