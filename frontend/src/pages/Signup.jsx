import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    contact: '',
    role: 'user',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Swal.fire({
        title: 'Form Error',
        text: 'Name field khali nahi ho sakta',
        icon: 'warning'
      });
      return false;
    }

    if (!formData.email) {
      Swal.fire({
        title: 'Form Error',
        text: 'Email field khali nahi ho sakta',
        icon: 'warning'
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Swal.fire({
        title: 'Form Error',
        text: 'Email address sahi nahi hai',
        icon: 'warning'
      });
      return false;
    }

    if (!formData.password) {
      Swal.fire({
        title: 'Form Error',
        text: 'Password field khali nahi ho sakta',
        icon: 'warning'
      });
      return false;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        title: 'Form Error',
        text: 'Password kam se kam 6 characters ka hona chahiye',
        icon: 'warning'
      });
      return false;
    }

    if (!formData.age || isNaN(formData.age) || parseInt(formData.age) < 13) {
      Swal.fire({
        title: 'Form Error',
        text: 'Age 13 sal se zyada honi chahiye',
        icon: 'warning'
      });
      return false;
    }

    if (!formData.contact) {
      Swal.fire({
        title: 'Form Error',
        text: 'Contact number daalna zaroori hai',
        icon: 'warning'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.signup) {
        await Swal.fire({
          title: 'Mubarak Ho!',
          text: data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/login');
      } else {
        await Swal.fire({
          title: 'Oops...',
          text: data.message,
          icon: 'error'
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: 'Error',
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
          <h1>Create Account</h1>
          <p>Join us today! Create your account to start shopping.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="13"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your contact number"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button className="social-button google">
            <i className="fab fa-google"></i> Sign up with Google
          </button>
          <button className="social-button facebook">
            <i className="fab fa-facebook-f"></i> Sign up with Facebook
          </button>
        </div>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

