-- Pickleball Booking System - Database initialization
-- Run once to create database and base schema

CREATE DATABASE IF NOT EXISTS pickleball_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pickleball_db;

-- Tables will be added here as modules are implemented.
-- Suggested order: users -> courts -> schedules -> bookings
