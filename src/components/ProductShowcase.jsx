import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ProductShowcase.css';

const defaultProducts = [
  {
    id: 1,
    name: 'Classic Home Jersey',
    description: 'Premium fabric with a timeless look.',
    price: '59 TND',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Classic Away Jersey',
    description: 'Elegant styling for everyday wear.',
    price: '59 TND',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Premium Training Kit',
    description: 'Comfortable and breathable for training.',
    price: '79 TND',
    image: 'https://images.unsplash.com/photo-1521417531039-2d64f6e7bc10?auto=format&fit=crop&w=900&q=80',
  },
];

const ProductShowcase = () => {
  const [products] = useState(defaultProducts);

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
      </div>
    </section>
  );
};

export default ProductShowcase;
