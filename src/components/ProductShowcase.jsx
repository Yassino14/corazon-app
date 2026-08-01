import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ProductShowcase.css';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="products" className="products-section container">
      <motion.div 
        className="section-header text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Latest <span className="text-accent-gradient">Arrivals</span></h2>
        <p className="text-muted">Discover our handpicked selection of premium jerseys.</p>
      </motion.div>
      
      <div className="products-grid">
        {products.map((product, i) => (
          <motion.div 
            key={product.id} 
            className="product-card glass-panel"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
          >
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">{product.price}</span>
                <a href="#contact" className="btn btn-primary btn-sm">Order</a>
              </div>
            </div>
          </motion.div>
        ))}
        {products.length === 0 && <p className="text-center w-100">Loading products...</p>}
      </div>
    </section>
  );
};

export default ProductShowcase;
