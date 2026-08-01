import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('clientToken', data.token);
        localStorage.setItem('clientUser', JSON.stringify(data.user));
        navigate('/account');
      } else {
        setError(data.error || 'Login failed');
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
          style={{width: '100%', maxWidth: '500px'}}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Client <span className="text-accent-gradient">Login</span></h2>
          {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
          <form onSubmit={handleLogin} className="contact-form">
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required />
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{marginTop: '1rem'}}>Log In</button>
            <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
              Don't have an account? <Link to="/register" style={{color: 'var(--color-accent)'}}>Register here</Link>
            </p>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};
export default ClientLogin;
