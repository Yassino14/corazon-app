import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const ClientAccount = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userStr = localStorage.getItem('clientUser');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:5000/api/client/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('clientToken');
        navigate('/login');
        return;
      }
      return res.json();
    })
    .then(data => setOrders(data || []))
    .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientUser');
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{minHeight: '80vh', paddingTop: '150px'}}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
            <h2>Welcome, <span className="text-accent-gradient">{user?.name}</span></h2>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>

          <h3 style={{marginBottom: '1.5rem', fontFamily: 'var(--font-heading)'}}>Your Orders</h3>
          <div className="glass-panel" style={{padding: '2rem', overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead>
                <tr style={{borderBottom: '1px solid var(--glass-border)', color: 'var(--color-accent)'}}>
                  <th style={{padding: '1rem'}}>Order #</th>
                  <th style={{padding: '1rem'}}>Product</th>
                  <th style={{padding: '1rem'}}>Status</th>
                  <th style={{padding: '1rem'}}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{borderBottom: '1px solid var(--glass-border)'}}>
                    <td style={{padding: '1rem'}}>#{o.id}</td>
                    <td style={{padding: '1rem'}}>{o.product_name}</td>
                    <td style={{padding: '1rem'}}><span className={`badge ${o.status}`}>{o.status}</span></td>
                    <td style={{padding: '1rem'}}>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan="4" style={{padding: '2rem', textAlign: 'center'}}>You have no past orders.</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};
export default ClientAccount;
