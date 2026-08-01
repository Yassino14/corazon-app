import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import ContactOrderForm from './components/ContactOrderForm';
import Footer from './components/Footer';
import ClientLogin from './components/ClientLogin';
import ClientRegister from './components/ClientRegister';
import ClientAccount from './components/ClientAccount';

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <main>
      <ProductShowcase />
      <ContactOrderForm />
    </main>
    <Footer />
  </>
);

function ClientApp() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<ClientRegister />} />
        <Route path="/account" element={<ClientAccount />} />
      </Routes>
    </div>
  );
}

export default ClientApp;
