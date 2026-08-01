import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  const clientUserStr = localStorage.getItem('clientUser');
  const clientUser = clientUserStr ? JSON.parse(clientUserStr) : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo-container">
          <img src="/logo.png" alt="Corazon Logo" className="logo-img" />
          <span className="logo-text">CORAZON</span>
        </Link>
        <ul className="nav-links">
          <li><a href="/#home">Home</a></li>
          <li><a href="/#products">Collection</a></li>
          <li><a href="/#contact">Order Now</a></li>
          {clientUser ? (
            <li><Link to="/account" style={{color: 'var(--color-accent)'}}>My Account</Link></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
