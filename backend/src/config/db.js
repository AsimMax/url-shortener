const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

async function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      short_code VARCHAR(12) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      clicks INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls (short_code);
  `;
  await pool.query(createTableQuery);
  console.log('PostgreSQL: urls table ready');
}

module.exports = { pool, initDb };
