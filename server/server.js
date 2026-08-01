require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'supersecretcorazon_jwt_key';

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ADMIN AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// --- CLIENT AUTH ---
app.post('/api/auth/client-register', (req, res) => {
  const { name, email, phone, address, password } = req.body;
  try {
    const existing = db.prepare('SELECT * FROM clients WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    const info = db.prepare('INSERT INTO clients (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)')
                   .run(name, email, phone, address, password);
    const token = jwt.sign({ id: info.lastInsertRowid, email, role: 'client' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/client-login', (req, res) => {
  const { email, password } = req.body;
  const client = db.prepare('SELECT * FROM clients WHERE email = ? AND password = ?').get(email, password);
  if (client) {
    const token = jwt.sign({ id: client.id, email: client.email, role: 'client' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { name: client.name, email: client.email } });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// --- PRODUCTS ---
app.get('/api/products', (req, res) => {
  res.json(db.prepare('SELECT * FROM products').all());
});
app.post('/api/products', authenticateToken, (req, res) => {
  const { name, price, image, description } = req.body;
  const info = db.prepare('INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)')
                 .run(name, price, image, description);
  res.json({ id: info.lastInsertRowid });
});
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- CLIENTS ADMIN ---
app.get('/api/clients', authenticateToken, (req, res) => {
  res.json(db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all());
});

// --- ORDERS ---
app.get('/api/orders', authenticateToken, (req, res) => {
  const orders = db.prepare(`
    SELECT orders.*, clients.name as client_name, clients.email as client_email, clients.phone as client_phone 
    FROM orders JOIN clients ON orders.client_id = clients.id ORDER BY orders.created_at DESC
  `).all();
  res.json(orders);
});

app.get('/api/client/orders', authenticateToken, (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({error: 'Not a client'});
  const orders = db.prepare('SELECT * FROM orders WHERE client_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  // Guest checkout or logged in client checkout
  const { name, email, phone, jersey, message, client_id } = req.body;
  
  try {
    let clientIdToUse = client_id;
    if (!clientIdToUse) {
      // Guest or auto-associate
      let client = db.prepare('SELECT * FROM clients WHERE email = ?').get(email);
      if (!client) {
        const clientInfo = db.prepare('INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)')
                             .run(name, email, phone, message);
        clientIdToUse = clientInfo.lastInsertRowid;
      } else {
        clientIdToUse = client.id;
      }
    }

    const orderInfo = db.prepare('INSERT INTO orders (client_id, product_name, message) VALUES (?, ?, ?)')
                        .run(clientIdToUse, jersey, message);

    // Email Notification
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";
    if (accessKey !== "YOUR_ACCESS_KEY_HERE") {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "New Order from Corazon Store",
          from_name: "Corazon System",
          name: name,
          email: email,
          message: `New Order ID: ${orderInfo.lastInsertRowid}\nClient Name: ${name}\nPhone: ${phone}\nProduct: ${jersey}\nMessage/Address: ${message}`
        })
      });
    }
    res.json({ success: true, orderId: orderInfo.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
