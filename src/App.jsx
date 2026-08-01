import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientApp from './ClientApp';
import AdminApp from './AdminApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<ClientApp />} />
      </Routes>
    </Router>
  );
}

export default App;
