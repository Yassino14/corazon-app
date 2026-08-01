import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-background"></div>
      <div className="container hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="hero-title">
            Wear The Passion.<br />
            <span className="text-accent-gradient">Live The Game.</span>
          </h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Premium international football jerseys delivered right to your door in Tunisia. Elevate your match-day style with Corazon.
          </motion.p>
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <a href="#products" className="btn btn-primary">Explore Collection</a>
            <a href="#contact" className="btn btn-secondary" style={{marginLeft: '1rem'}}>Contact Us</a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
