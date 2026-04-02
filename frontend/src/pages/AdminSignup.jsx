import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    contact: '',
    role: 'admin'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) < 18) {
      newErrors.age = 'Age must be at least 18 years';
    }

    if (!formData.contact) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10,15}$/.test(formData.contact.replace(/[-()\s]/g, ''))) {
      newErrors.contact = 'Please enter a valid contact number';
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
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age,
        contact: formData.contact,
        role: formData.role
      };

      const response = await fetch('http://localhost:5000/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      
      if (response.ok && data.signup) {
        await Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/admin/login');
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.message || 'Signup failed',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: 'Error',
        text: 'Server connection failed',
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
          <h1>{formData.role === 'admin' ? 'Admin Registration' : 'Employee Registration'}</h1>
          <p>Create an account to manage the store with {formData.role === 'admin' ? 'administrator' : 'employee'} privileges</p>
        </div>

        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

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
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
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
              placeholder="Create a strong password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
            <div className="password-requirements">
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="18"
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <div className="error-message">{errors.age}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <div className="role-selector">
              <div
                className={`role-option ${formData.role === 'admin' ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, role: 'admin'})}
              >
                <i className="fas fa-user-shield"></i>
                <div className="role-details">
                  <span className="role-name">Administrator</span>
                  <span className="role-description">Full system access and control</span>
                </div>
              </div>
              <div
                className={`role-option ${formData.role === 'employee' ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, role: 'employee'})}
              >
                <i className="fas fa-user-tie"></i>
                <div className="role-details">
                  <span className="role-name">Employee</span>
                  <span className="role-description">Limited management access</span>
                </div>
              </div>
            </div>
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
              className={errors.contact ? 'error' : ''}
            />
            {errors.contact && <div className="error-message">{errors.contact}</div>}
          </div>

        

          <button
            type="submit"
            className="auth-button admin-auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : `Create ${formData.role === 'admin' ? 'Admin' : 'Employee'} Account`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an admin account? <Link to="/admin/login">Login</Link>
        </div>

        <div className="admin-security-notice">
          <i className="fas fa-shield-alt"></i>
          <p>
            {formData.role === 'admin'
              ? "Administrator accounts have full system access. All actions are logged and monitored for security purposes."
              : "Employee accounts have limited access based on assigned permissions. All actions are logged and monitored."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;



