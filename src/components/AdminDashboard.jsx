import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [data, setData] = useState({ orders: [], clients: [], products: [] });
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [ordersRes, clientsRes, productsRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders', { headers }),
        fetch('http://localhost:5000/api/clients', { headers }),
        fetch('http://localhost:5000/api/products')
      ]);

      if (ordersRes.status === 401 || ordersRes.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const orders = await ordersRes.json();
      const clients = await clientsRes.json();
      const products = await productsRes.json();

      setData({ orders, clients, products });
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass-panel">
        <div className="sidebar-brand">
          <h2>CORAZON <span style={{color: 'var(--color-accent)'}}>Admin</span></h2>
        </div>
        <ul className="sidebar-nav">
          <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</li>
          <li className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>Clients</li>
          <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</li>
        </ul>
        <button className="btn btn-secondary w-100" style={{marginTop: 'auto'}} onClick={handleLogout}>Logout</button>
      </aside>
      
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
        </header>

        <div className="data-view glass-panel">
          {activeTab === 'orders' && (
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Client</th><th>Product</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.client_name} ({o.client_phone})</td>
                    <td>{o.product_name}</td>
                    <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {data.orders.length === 0 && <tr><td colSpan="5">No orders found.</td></tr>}
              </tbody>
            </table>
          )}

          {activeTab === 'clients' && (
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th></tr></thead>
              <tbody>
                {data.clients.map(c => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.address}</td>
                  </tr>
                ))}
                {data.clients.length === 0 && <tr><td colSpan="5">No clients found.</td></tr>}
              </tbody>
            </table>
          )}

          {activeTab === 'products' && (
            <div className="products-admin">
              <button className="btn btn-primary" style={{marginBottom: '1rem'}}>+ Add New Product</button>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Image</th><th>Name</th><th>Price</th></tr></thead>
                <tbody>
                  {data.products.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><img src={p.image} alt={p.name} style={{width: '50px'}} /></td>
                      <td>{p.name}</td>
                      <td>{p.price}</td>
                    </tr>
                  ))}
                  {data.products.length === 0 && <tr><td colSpan="4">No products found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
