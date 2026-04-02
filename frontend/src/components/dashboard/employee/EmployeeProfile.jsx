import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EmployeeProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  useEffect(() => {
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get email from token
      const token = localStorage.getItem('token');
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const email = payload.email;
      
      const response = await fetch(`http://localhost:5000/user?email=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserData(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        contact: data.contact || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleEditProfile = () => {
    setEditMode(true);
  };
  
  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      ...formData,
      name: userData.name || '',
      contact: userData.contact || ''
    });
  };
  
  const handleSaveProfile = async () => {
    try {
      // In a real app, you would send an API request to update the profile
      // For now, we'll just show a success message
      
      Swal.fire({
        title: 'Success',
        text: 'Profile updated successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Update local state
      setUserData({
        ...userData,
        name: formData.name,
        contact: formData.contact
      });
      
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update profile',
        icon: 'error'
      });
    }
  };
  
  const handleChangePassword = () => {
    setChangePassword(true);
  };
  
  const handleCancelPasswordChange = () => {
    setChangePassword(false);
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handleSavePassword = async () => {
    // Validate passwords
    if (!formData.currentPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter your current password',
        icon: 'error'
      });
      return;
    }
    
    if (!formData.newPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a new password',
        icon: 'error'
      });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'New password and confirm password do not match',
        icon: 'error'
      });
      return;
    }
    
    try {
      // In a real app, you would send an API request to change the password
      // For now, we'll just show a success message
      
      Swal.fire({
        title: 'Success',
        text: 'Password changed successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      setChangePassword(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to change password',
        icon: 'error'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={fetchUserData}>Try Again</button>
      </div>
    );
  }
  
  return (
    <div className="employee-profile">
      <h2>My Profile</h2>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <span className="avatar-initials">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : userData?.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="profile-title">
              <h3>{userData?.name || 'Employee'}</h3>
              <p>{userData?.email}</p>
              <span className="role-badge">{userData?.role}</span>
            </div>
          </div>
          
          <div className="profile-body">
            {editMode ? (
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contact">Contact</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                </div>
              </div>
            ) : changePassword ? (
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button className="cancel-btn" onClick={handleCancelPasswordChange}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSavePassword}>
                    Change Password
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-info">
                  <div className="info-group">
                    <span className="info-label">Name</span>
                    <span className="info-value">{userData?.name || 'Not set'}</span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Email</span>
                    <span className="info-value">{userData?.email}</span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Contact</span>
                    <span className="info-value">{userData?.contact || 'Not set'}</span>
                  </div>
                  
                  <div className="info-group">
                    <span className="info-label">Role</span>
                    <span className="info-value">{userData?.role}</span>
                  </div>
                </div>
                
                <div className="profile-actions">
                  <button className="edit-btn" onClick={handleEditProfile}>
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                  <button className="password-btn" onClick={handleChangePassword}>
                    <i className="fas fa-key"></i> Change Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
