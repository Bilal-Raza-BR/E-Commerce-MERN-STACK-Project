import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EmployeeCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/dashboard/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers. Please try again later.');
      setLoading(false);
      
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading customers...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={fetchCustomers}>Try Again</button>
      </div>
    );
  }
  
  return (
    <div className="employee-customers">
      <div className="customers-header">
        <h2>Customer Management</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>
      
      <div className="customers-table-container">
        {filteredCustomers.length === 0 ? (
          <div className="no-customers">
            <i className="fas fa-users"></i>
            <p>No customers found</p>
          </div>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <div className="customer-name">
                      <div className="customer-avatar">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{customer.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.contact || 'N/A'}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="customer-actions">
                      <button 
                        className="view-customer-btn"
                        onClick={() => {
                          Swal.fire({
                            title: customer.name || 'Customer Details',
                            html: `
                              <div style="text-align: left;">
                                <p><strong>Name:</strong> ${customer.name || 'N/A'}</p>
                                <p><strong>Email:</strong> ${customer.email}</p>
                                <p><strong>Contact:</strong> ${customer.contact || 'N/A'}</p>
                                <p><strong>Age:</strong> ${customer.age || 'N/A'}</p>
                                <p><strong>Joined:</strong> ${new Date(customer.createdAt).toLocaleDateString()}</p>
                              </div>
                            `,
                            showCloseButton: true,
                            showConfirmButton: false
                          });
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeCustomers;
