import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const DashboardSidebar = ({ activeTab, onTabChange, userRole }) => {
  const navigate = useNavigate();
  
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
        });
      }
    });
  };
  
  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo">
          <i className="fas fa-store"></i>
          <span>E-Commerce</span>
        </Link>
      </div>
      
      <div className="sidebar-menu">
        <h3>Main</h3>
        <ul>
          <li 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => onTabChange('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Overview</span>
          </li>
          
          <li 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => onTabChange('orders')}
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </li>
          
          <li 
            className={activeTab === 'customers' ? 'active' : ''}
            onClick={() => onTabChange('customers')}
          >
            <i className="fas fa-users"></i>
            <span>Customers</span>
          </li>
        </ul>
        
        {userRole === 'admin' && (
          <>
            <h3>Admin</h3>
            <ul>
              <li 
                className={activeTab === 'products' ? 'active' : ''}
                onClick={() => onTabChange('products')}
              >
                <i className="fas fa-box"></i>
                <span>Products</span>
              </li>
              
              <li 
                className={activeTab === 'employees' ? 'active' : ''}
                onClick={() => onTabChange('employees')}
              >
                <i className="fas fa-user-tie"></i>
                <span>Employees</span>
              </li>
              
              <li 
                className={activeTab === 'settings' ? 'active' : ''}
                onClick={() => onTabChange('settings')}
              >
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </li>
            </ul>
          </>
        )}
        
        <h3>Account</h3>
        <ul>
          <li 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => onTabChange('profile')}
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </li>
          
          <li onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <Link to="/" className="back-to-site">
          <i className="fas fa-arrow-left"></i>
          <span>Back to Website</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
