require('dotenv').config();

const app = require('./app');
const { initDb } = require('./config/db');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectRedis();
    await initDb();

    app.listen(PORT, () => {
      console.log(`URL Shortener backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
