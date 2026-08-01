import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ContactOrderForm.css';

const defaultProducts = [
  { id: 1, name: 'Classic Home Jersey' },
  { id: 2, name: 'Classic Away Jersey' },
  { id: 3, name: 'Premium Training Kit' },
];

const ContactOrderForm = () => {
  const [result, setResult] = useState('');
  const [products] = useState(defaultProducts);

  const clientUserStr = localStorage.getItem('clientUser');
  const clientUser = clientUserStr ? JSON.parse(clientUserStr) : null;

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult('Sending...');

    const formData = new FormData(event.target);
    const name = formData.get('name')?.toString() || 'Customer';

    formData.append('_subject', `New order request from ${name}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('_next', window.location.href);

    try {
      const response = await fetch('https://formsubmit.co/ajax/louatiyassino8b4@gmail.com', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setResult('Order submitted successfully! We will contact you soon.');
        event.target.reset();
      } else {
        setResult('Failed to submit order. Please try again later.');
      }
    } catch (err) {
      setResult('Server error. Please try again later.');
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
                {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
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
