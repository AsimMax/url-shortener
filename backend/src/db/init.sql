-- This runs automatically on backend startup (see src/config/db.js).
-- Kept here for reference or manual setup if you prefer.

CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(12) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls (short_code);
