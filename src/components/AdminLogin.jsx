import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../apiConfig';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginAdmin(username, password);

      if (result.ok) {
        localStorage.setItem('adminToken', result.data.token);
        navigate('/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Server connection failed');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="glass-panel login-box">
        <h2>Admin Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              className="input-field" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
