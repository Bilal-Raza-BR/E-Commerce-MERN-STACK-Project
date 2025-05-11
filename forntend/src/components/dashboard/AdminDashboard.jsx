import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminOverview from './admin/AdminOverview';
import AdminOrders from './admin/AdminOrders';
import AdminCustomers from './admin/AdminCustomers';
import AdminProducts from './admin/AdminProducts';
import AdminEmployees from './admin/AdminEmployees';
import AdminSettings from './admin/AdminSettings';
import AdminProfile from './admin/AdminProfile';

const AdminDashboard = ({ activeTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAdminStats();
    }
  }, [activeTab]);
  
  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }
      
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
      
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview stats={stats} loading={loading} error={error} />;
      case 'orders':
        return <AdminOrders />;
      case 'customers':
        return <AdminCustomers />;
      case 'products':
        return <AdminProducts />;
      case 'employees':
        return <AdminEmployees />;
      case 'settings':
        return <AdminSettings />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <AdminOverview stats={stats} loading={loading} error={error} />;
    }
  };
  
  return (
    <div className="admin-dashboard">
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
