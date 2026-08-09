const request = require('supertest');

// Mock DB and Redis so this test can run in CI without real services
jest.mock('../config/db', () => ({
  pool: { query: jest.fn(), on: jest.fn() },
  initDb: jest.fn(),
}));
jest.mock('../config/redis', () => ({
  redisClient: { get: jest.fn(), set: jest.fn(), isOpen: true },
  connectRedis: jest.fn(),
  CACHE_TTL_SECONDS: 86400,
}));

const app = require('../app');

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
