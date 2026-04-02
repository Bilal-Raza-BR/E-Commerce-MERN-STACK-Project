import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // forgat passwor function
  const handleForgatPassword = () => {
    navigate('/verify-otp');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.login) {
        window.localStorage.setItem("token", data.token);

        // Dispatch custom event to notify other components about login
        window.dispatchEvent(new Event('loginStatusChanged'));

        await Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/');
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Welcome back! Please login to your account.</p>
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
              placeholder="Enter your email"
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
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password" onClick={handleForgatPassword}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button
            className="social-button google"
            onClick={() => {
              Swal.fire({
                title: 'Google Login',
                text: 'Google login will be implemented in the next phase.',
                icon: 'info'
              });
            }}
          >
            <i className="fab fa-google"></i> Continue with Google
          </button>
          <button
            className="social-button facebook"
            onClick={() => {
              Swal.fire({
                title: 'Facebook Login',
                text: 'Facebook login will be implemented in the next phase.',
                icon: 'info'
              });
            }}
          >
            <i className="fab fa-facebook-f"></i> Continue with Facebook
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


