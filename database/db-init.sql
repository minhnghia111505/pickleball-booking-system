-- Pickleball Booking System - Database initialization
-- Run once to create database and base schema

CREATE DATABASE IF NOT EXISTS pickleball_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pickleball_db;

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    avatar_url  VARCHAR(512),
    role        VARCHAR(20)  NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at  DATETIME(6)  NOT NULL,
    updated_at  DATETIME(6)  NOT NULL,
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255)
);

CREATE INDEX idx_users_email ON users (email);

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

CREATE TABLE IF NOT EXISTS bookings (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT         NOT NULL,
    court_id          BIGINT         NOT NULL,
    booking_date      DATE           NOT NULL,
    start_time        TIME(6)        NOT NULL,
    end_time          TIME(6)        NOT NULL,
    booking_status    VARCHAR(20)    NOT NULL,
    total_amount      DECIMAL(12, 2),
    payment_status    VARCHAR(20),
    payment_reference VARCHAR(255),
    created_at        DATETIME(6)    NOT NULL,
    updated_at        DATETIME(6)    NOT NULL,
    created_by        VARCHAR(255),
    updated_by        VARCHAR(255),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_bookings_court FOREIGN KEY (court_id) REFERENCES courts (id)
);

CREATE INDEX idx_bookings_court_date ON bookings (court_id, booking_date);
CREATE INDEX idx_bookings_user ON bookings (user_id);
