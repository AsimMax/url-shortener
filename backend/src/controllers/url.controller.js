const validUrl = require('valid-url');
const urlModel = require('../models/url.model');
const { generateShortCode } = require('../utils/shortCode');
const { redisClient, CACHE_TTL_SECONDS } = require('../config/redis');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function shortenUrl(req, res, next) {
  try {
    const { url, customCode } = req.body;

    if (!url || !validUrl.isWebUri(url)) {
      return res.status(400).json({ error: 'Please provide a valid URL (include http:// or https://)' });
    }

    // Return existing short code if this URL was already shortened
    const existing = await urlModel.findByOriginalUrl(url);
    if (existing && !customCode) {
      return res.status(200).json(formatResponse(existing));
    }

    let shortCode = customCode ? customCode.trim() : generateShortCode();

    if (customCode) {
      const clash = await urlModel.findByShortCode(shortCode);
      if (clash) {
        return res.status(409).json({ error: 'That custom code is already taken' });
      }
    }

    const created = await urlModel.createUrl(shortCode, url);

    await redisClient.set(`short:${shortCode}`, url, { EX: CACHE_TTL_SECONDS });

    return res.status(201).json(formatResponse(created));
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'That custom code is already taken' });
    }
    next(err);
  }
}

async function redirectToOriginal(req, res, next) {
  try {
    const { code } = req.params;

    let originalUrl = await redisClient.get(`short:${code}`);

    if (!originalUrl) {
      const record = await urlModel.findByShortCode(code);
      if (!record) {
        return res.status(404).json({ error: 'Short link not found' });
      }
      originalUrl = record.original_url;
      await redisClient.set(`short:${code}`, originalUrl, { EX: CACHE_TTL_SECONDS });
    }

    await urlModel.incrementClicks(code);

    return res.redirect(302, originalUrl);
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const { code } = req.params;
    const record = await urlModel.findByShortCode(code);
    if (!record) {
      return res.status(404).json({ error: 'Short link not found' });
    }
    return res.json(formatResponse(record));
  } catch (err) {
    next(err);
  }
}

async function listRecent(req, res, next) {
  try {
    const rows = await urlModel.getRecentUrls(20);
    return res.json(rows.map(formatResponse));
  } catch (err) {
    next(err);
  }
}

function formatResponse(row) {
  return {
    shortCode: row.short_code,
    shortUrl: `${BASE_URL}/r/${row.short_code}`,
    originalUrl: row.original_url,
    clicks: row.clicks,
    createdAt: row.created_at,
  };
}

module.exports = { shortenUrl, redirectToOriginal, getStats, listRecent };
