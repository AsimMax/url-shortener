const { nanoid } = require('nanoid');

// 7-character URL-safe short code, e.g. "aZ3kLp9"
function generateShortCode(length = 7) {
  return nanoid(length);
}

module.exports = { generateShortCode };
