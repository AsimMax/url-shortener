const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const urlRoutes = require('./routes/url.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  })
);
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/', urlRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
