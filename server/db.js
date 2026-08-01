const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDB() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'YOUR_DATABASE_URL_HERE') {
    console.warn("⚠️ DATABASE_URL is not set in .env. Skipping database initialization.");
    return;
  }

  try {
    // Initialize Database Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        price VARCHAR(255),
        image VARCHAR(255),
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        product_name VARCHAR(255),
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(client_id) REFERENCES clients(id)
      );
    `);

    // Seed default Admin User
    await pool.query(`
      INSERT INTO users (username, password) 
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
    `, ['admin', 'admin123']);

    // Seed 20 European Jerseys
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM products');
    if (parseInt(rows[0].count, 10) === 0) {
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
        await pool.query(
          'INSERT INTO products (name, price, image, description) VALUES ($1, $2, $3, $4)',
          [team.name, '120 TND', team.image, 'Official replica, premium breathable fabric. Top European Club.']
        );
      }
      console.log("Seeded 20 default products.");
    }
  } catch (err) {
    console.error("Database Initialization Error:", err);
  }
}

// Automatically init when this file is required
initDB();

module.exports = pool;
