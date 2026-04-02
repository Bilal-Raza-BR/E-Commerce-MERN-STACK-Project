import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
          const response = await fetch('http://localhost:5000/admin/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });

          const data = await response.json();

          if (data.login) {
            window.localStorage.setItem("token", data.token);
            await Swal.fire({
              title: 'Success!',
              text: data.message,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });

            // Dispatch custom event to notify other components about login
            window.dispatchEvent(new Event('loginStatusChanged'));

            navigate('/dashboard');
          } else {
            await Swal.fire({
              title: 'Error!',
              text: data.message,
              icon: 'error'
            });
          }
        } catch (err) {
          await Swal.fire({
            title: 'Error!',
            text: 'Server se connect nahi ho saka',
            icon: 'error'
          });
        } finally {
          setIsLoading(false);
        }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-container admin-auth-container">
        <div className="auth-header">
          <h1>Admin Login</h1>
          <p>Sign in to access the administrator dashboard</p>
        </div>

        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your admin email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-options">
            <Link to="/admin/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button admin-auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Need an admin account? <Link to="/admin/signup">Register</Link>
        </div>

        <div className="admin-security-notice">
          <i className="fas fa-shield-alt"></i>
          <p>
            This area is restricted to authorized personnel only. Unauthorized access attempts are logged and may be reported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

