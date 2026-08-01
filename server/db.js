const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price TEXT,
    image TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    product_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id)
  );
`);

// Seed default Admin User
const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
insertUser.run('admin', 'admin123');

// Seed 20 European Jerseys
const countProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (countProducts.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)');
  
  const teams = [
    { name: 'Real Madrid Home Kit', image: '/real_madrid.png' },
    { name: 'FC Barcelona Home Kit', image: '/barcelona.png' },
    { name: 'Manchester City Home Kit', image: '/mancity.png' },
    { name: 'Arsenal Home Kit', image: '/logo.png' },
    { name: 'Liverpool Home Kit', image: '/logo.png' },
    { name: 'Manchester United Home Kit', image: '/logo.png' },
    { name: 'Chelsea Home Kit', image: '/logo.png' },
    { name: 'Tottenham Hotspur Home Kit', image: '/logo.png' },
    { name: 'Bayern Munich Home Kit', image: '/logo.png' },
    { name: 'Borussia Dortmund Home Kit', image: '/logo.png' },
    { name: 'Bayer Leverkusen Home Kit', image: '/logo.png' },
    { name: 'Paris Saint-Germain Home Kit', image: '/logo.png' },
    { name: 'Juventus Home Kit', image: '/logo.png' },
    { name: 'AC Milan Home Kit', image: '/logo.png' },
    { name: 'Inter Milan Home Kit', image: '/logo.png' },
    { name: 'Napoli Home Kit', image: '/logo.png' },
    { name: 'AS Roma Home Kit', image: '/logo.png' },
    { name: 'Atletico Madrid Home Kit', image: '/logo.png' },
    { name: 'Aston Villa Home Kit', image: '/logo.png' },
    { name: 'Newcastle United Home Kit', image: '/logo.png' }
  ];

  for (const team of teams) {
    insertProduct.run(team.name, '120 TND', team.image, 'Official replica, premium breathable fabric. Top European Club.');
  }
}

module.exports = db;
