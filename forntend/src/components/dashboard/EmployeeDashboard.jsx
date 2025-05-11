import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import EmployeeOverview from './employee/EmployeeOverview';
import EmployeeOrders from './employee/EmployeeOrders';
import EmployeeCustomers from './employee/EmployeeCustomers';
import EmployeeProfile from './employee/EmployeeProfile';

const EmployeeDashboard = ({ activeTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchEmployeeStats();
    }
  }, [activeTab]);
  
  const fetchEmployeeStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/dashboard/employee-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employee stats');
      }
      
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employee stats:', error);
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
        return <EmployeeOverview stats={stats} loading={loading} error={error} />;
      case 'orders':
        return <EmployeeOrders />;
      case 'customers':
        return <EmployeeCustomers />;
      case 'profile':
        return <EmployeeProfile />;
      default:
        return <EmployeeOverview stats={stats} loading={loading} error={error} />;
    }
  };
  
  return (
    <div className="employee-dashboard">
      {renderContent()}
    </div>
  );
};

export default EmployeeDashboard;
