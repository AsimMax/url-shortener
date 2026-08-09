const { pool } = require('../config/db');

async function createUrl(shortCode, originalUrl) {
  const result = await pool.query(
    `INSERT INTO urls (short_code, original_url) VALUES ($1, $2) RETURNING *`,
    [shortCode, originalUrl]
  );
  return result.rows[0];
}

async function findByShortCode(shortCode) {
  const result = await pool.query(
    `SELECT * FROM urls WHERE short_code = $1`,
    [shortCode]
  );
  return result.rows[0] || null;
}

async function findByOriginalUrl(originalUrl) {
  const result = await pool.query(
    `SELECT * FROM urls WHERE original_url = $1 ORDER BY created_at DESC LIMIT 1`,
    [originalUrl]
  );
  return result.rows[0] || null;
}

async function incrementClicks(shortCode) {
  const result = await pool.query(
    `UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1 RETURNING clicks`,
    [shortCode]
  );
  return result.rows[0] || null;
}

async function getRecentUrls(limit = 10) {
  const result = await pool.query(
    `SELECT short_code, original_url, clicks, created_at
     FROM urls ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

module.exports = {
  createUrl,
  findByShortCode,
  findByOriginalUrl,
  incrementClicks,
  getRecentUrls,
};
