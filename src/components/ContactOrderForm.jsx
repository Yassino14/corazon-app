import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ContactOrderForm.css';

const ContactOrderForm = () => {
  const [result, setResult] = useState("");
  const [products, setProducts] = useState([]);
  
  const clientUserStr = localStorage.getItem('clientUser');
  const clientUser = clientUserStr ? JSON.parse(clientUserStr) : null;

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const resData = await response.json();

      if (resData.success) {
        setResult("Order submitted successfully! We will contact you soon.");
        event.target.reset();
      } else {
        setResult(resData.error || "Failed to submit order");
      }
    } catch (err) {
      setResult("Server error. Please try again later.");
    }
  };

  return (
    <section id="contact" className="contact-section container">
      <motion.div 
        className="glass-panel contact-container"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="contact-info">
          <h2>Place Your <span className="text-accent-gradient">Order</span></h2>
          <p>Fill out the form below to order your jersey or contact us for inquiries. We'll get back to you to confirm details and shipping.</p>
        </div>
        <div className="contact-form-wrapper">
          <form onSubmit={onSubmit} className="contact-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" defaultValue={clientUser?.name || ''} className="input-field" required placeholder="John Doe" />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" defaultValue={clientUser?.email || ''} className="input-field" required placeholder="john@example.com" />
            </div>
            <div className="input-group">
              <label>Phone Number (Tunisia)</label>
              <input type="tel" name="phone" className="input-field" required placeholder="+216 XX XXX XXX" />
            </div>
            <div className="input-group">
              <label>Which jersey do you want?</label>
              <select name="jersey" className="input-field" required defaultValue="">
                <option value="" disabled>Select a jersey</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                <option value="Other">Other (Specify in message)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Message / Address</label>
              <textarea name="message" className="input-field" rows="4" required placeholder="Enter your full address and any specific requirements (size, etc.)"></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Send Order</button>
            <span className="form-result">{result}</span>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactOrderForm;
