import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './Admin.css';

const AdminApp = () => {
  return (
    <div className="admin-app">
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="/" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminApp;
