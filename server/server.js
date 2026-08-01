require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');

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
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    const user = rows[0];
    if (user) {
      const token = jwt.sign({ id: user.id, username: user.username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- CLIENT AUTH ---
app.post('/api/auth/client-register', async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });
    
    const { rows } = await pool.query(
      'INSERT INTO clients (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, phone, address, password]
    );
    const token = jwt.sign({ id: rows[0].id, email, role: 'client' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/client-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM clients WHERE email = $1 AND password = $2', [email, password]);
    const client = rows[0];
    if (client) {
      const token = jwt.sign({ id: client.id, email: client.email, role: 'client' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { name: client.name, email: client.email } });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const { name, price, image, description } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (name, price, image, description) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, price, image, description]
    );
    res.json({ id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- CLIENTS ADMIN ---
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// --- ORDERS ---
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT orders.*, clients.name as client_name, clients.email as client_email, clients.phone as client_phone 
      FROM orders JOIN clients ON orders.client_id = clients.id ORDER BY orders.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/client/orders', authenticateToken, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({error: 'Not a client'});
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE client_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch client orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  // Guest checkout or logged in client checkout
  const { name, email, phone, jersey, message, client_id } = req.body;
  
  try {
    let clientIdToUse = client_id;
    if (!clientIdToUse) {
      // Guest or auto-associate
      const { rows: clientRows } = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);
      let client = clientRows[0];
      if (!client) {
        const { rows: newClient } = await pool.query(
          'INSERT INTO clients (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING id',
          [name, email, phone, message]
        );
        clientIdToUse = newClient[0].id;
      } else {
        clientIdToUse = client.id;
      }
    }

    const { rows: orderRows } = await pool.query(
      'INSERT INTO orders (client_id, product_name, message) VALUES ($1, $2, $3) RETURNING id',
      [clientIdToUse, jersey, message]
    );
    const newOrderId = orderRows[0].id;

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
          message: `New Order ID: ${newOrderId}\nClient Name: ${name}\nPhone: ${phone}\nProduct: ${jersey}\nMessage/Address: ${message}`
        })
      });
    }
    res.json({ success: true, orderId: newOrderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
