import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo-container">
            <img src="/logo.png" alt="Corazon Logo" className="logo-img-small" />
            <h3>CORAZON</h3>
          </div>
          <p className="text-muted">Premium digital marketing and international football jerseys in Tunisia.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Collection</a></li>
            <li><a href="#contact">Order Now</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <p className="text-muted">&copy; {new Date().getFullYear()} Corazon Tunisia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
