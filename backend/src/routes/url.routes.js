const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  shortenUrl,
  redirectToOriginal,
  getStats,
  listRecent,
} = require('../controllers/url.controller');

const router = express.Router();

const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many requests, please try again later.' },
});

router.post('/api/shorten', shortenLimiter, shortenUrl);
router.get('/api/urls', listRecent);
router.get('/api/stats/:code', getStats);
router.get('/r/:code', redirectToOriginal);

module.exports = router;
