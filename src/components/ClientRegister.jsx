import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { registerClient } from '../apiConfig';

const ClientRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await registerClient(formData);
      if (result.ok) {
        localStorage.setItem('clientToken', result.data.token);
        localStorage.setItem('clientUser', JSON.stringify(result.data.user));
        navigate('/account');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-section container" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px'}}>
        <motion.div 
          className="glass-panel contact-form-wrapper" 
          style={{width: '100%', maxWidth: '600px'}}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Create <span className="text-accent-gradient">Account</span></h2>
          {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
          <form onSubmit={handleRegister} className="contact-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" required />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" onChange={e => setFormData({...formData, password: e.target.value})} className="input-field" required />
            </div>
            <div style={{display: 'flex', gap: '2rem'}}>
              <div className="input-group" style={{flex: 1}}>
                <label>Phone</label>
                <input type="tel" onChange={e => setFormData({...formData, phone: e.target.value})} className="input-field" required />
              </div>
              <div className="input-group" style={{flex: 1}}>
                <label>Address</label>
                <input type="text" onChange={e => setFormData({...formData, address: e.target.value})} className="input-field" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{marginTop: '1rem'}}>Register</button>
            <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
              Already have an account? <Link to="/login" style={{color: 'var(--color-accent)'}}>Log in here</Link>
            </p>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};
export default ClientRegister;
