import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Profile.css';
import Swal from 'sweetalert2';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Not Logged In!',
        text: 'Please login to view your profile',
        icon: 'warning',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    // Decode JWT token to get user data
    try {
      // Split the token into parts
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode the payload part (second part)
      const payload = JSON.parse(atob(tokenParts[1]));

      // Fetch user data from server using the email from token
      fetchUserData(payload.email);

      // Fetch user orders
      fetchUserOrders();
    } catch (error) {
      console.error('Error decoding token:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Could not verify your login. Please login again.',
        icon: 'error',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        handleLogout();
      });
    }
  }, [navigate]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/user?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If we can't fetch from server, try to use the token data directly
      const token = localStorage.getItem('token');
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      setUserData({ email: payload.email });
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setUserOrders(data);
      setOrdersLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersLoading(false);
    }
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
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Account</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i> Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-shopping-bag"></i> Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-tab-content">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <span className="avatar-initials">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : userData?.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="profile-name">{userData?.name || 'User'}</h2>
                <p className="profile-email">{userData?.email}</p>
              </div>

              <div className="profile-details">
                <h3>Personal Information</h3>
                <div className="profile-info-cards">
                  <div className="info-card">
                    <div className="info-card-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="info-card-content">
                      <h4>Name</h4>
                      <p>{userData?.name || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="info-card-content">
                      <h4>Email</h4>
                      <p>{userData?.email}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="info-card-content">
                      <h4>Contact</h4>
                      <p>{userData?.contact || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-icon">
                      <i className="fas fa-birthday-cake"></i>
                    </div>
                    <div className="info-card-content">
                      <h4>Age</h4>
                      <p>{userData?.age || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-icon">
                      <i className="fas fa-user-tag"></i>
                    </div>
                    <div className="info-card-content">
                      <h4>Role</h4>
                      <p>{userData?.role || 'User'}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="edit-profile-btn">
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                  <button className="change-password-btn">
                    <i className="fas fa-key"></i> Change Password
                  </button>
                </div>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <div className="stat-info">
                  <h3>{userOrders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Wishlist Items</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Reviews</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-tab-content">
            <h2>My Orders</h2>

            {ordersLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading orders...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-shopping-bag"></i>
                <p>You haven't placed any orders yet.</p>
                <button className="shop-now-btn" onClick={() => navigate('/')}>
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {userOrders.map(order => (
                  <div className="order-card" key={order._id}>
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order._id.substring(0, 8)}</h3>
                        <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div className="order-item-preview" key={index}>
                          <div className="order-item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="order-item-details">
                            <p className="item-name">{item.name}</p>
                            <p className="item-quantity">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="more-items">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <Link to={`/orders/${order._id}`} className="view-details-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-tab-content">
            <h2>Account Settings</h2>

            <div className="settings-section">
              <h3>Password</h3>
              <div className="settings-action">
                <button className="settings-btn">
                  <i className="fas fa-key"></i> Change Password
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h3>Notifications</h3>
              <div className="settings-option">
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <div className="option-text">
                  <p>Email Notifications</p>
                  <span>Receive order updates and promotions</span>
                </div>
              </div>

              <div className="settings-option">
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <div className="option-text">
                  <p>SMS Notifications</p>
                  <span>Receive order updates via SMS</span>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Privacy</h3>
              <div className="settings-action">
                <button className="settings-btn danger">
                  <i className="fas fa-trash-alt"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
