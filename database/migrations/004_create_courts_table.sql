-- Run on existing databases when upgrading without courts table
USE pickleball_db;

CREATE TABLE IF NOT EXISTS courts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200)   NOT NULL,
    address         VARCHAR(500)   NOT NULL,
    description     TEXT,
    price_per_hour  DECIMAL(10, 2) NOT NULL,
    status          VARCHAR(20)    NOT NULL,
    image_url       VARCHAR(512),
    created_at      DATETIME(6)    NOT NULL,
    updated_at      DATETIME(6)    NOT NULL,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

CREATE INDEX idx_courts_name ON courts (name);
