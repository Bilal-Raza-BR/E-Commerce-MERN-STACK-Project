import React from 'react';
import { Link } from 'react-router-dom';

const AdminOverview = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>No data available</p>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="admin-overview">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon customers">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon employees">
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-details">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Order Status</h3>
            </div>
            <div className="order-status-chart">
              <div className="status-item">
                <div className="status-label">
                  <span className="status-dot processing"></span>
                  <span>Processing</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-progress processing" 
                    style={{ 
                      width: `${(stats.orderStatusCounts.processing / stats.totalOrders) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="status-count">{stats.orderStatusCounts.processing}</div>
              </div>
              
              <div className="status-item">
                <div className="status-label">
                  <span className="status-dot shipped"></span>
                  <span>Shipped</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-progress shipped" 
                    style={{ 
                      width: `${(stats.orderStatusCounts.shipped / stats.totalOrders) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="status-count">{stats.orderStatusCounts.shipped}</div>
              </div>
              
              <div className="status-item">
                <div className="status-label">
                  <span className="status-dot delivered"></span>
                  <span>Delivered</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-progress delivered" 
                    style={{ 
                      width: `${(stats.orderStatusCounts.delivered / stats.totalOrders) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="status-count">{stats.orderStatusCounts.delivered}</div>
              </div>
              
              <div className="status-item">
                <div className="status-label">
                  <span className="status-dot cancelled"></span>
                  <span>Cancelled</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-progress cancelled" 
                    style={{ 
                      width: `${(stats.orderStatusCounts.cancelled / stats.totalOrders) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="status-count">{stats.orderStatusCounts.cancelled}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <Link to="#" className="view-all" onClick={() => document.querySelector('[data-tab="orders"]').click()}>
                View All
              </Link>
            </div>
            <div className="recent-orders">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.substring(0, 8)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${order.orderStatus}`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                      <td>{formatCurrency(order.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
