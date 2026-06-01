-- Run on existing databases when upgrading from schema without avatar_url
USE pickleball_db;

ALTER TABLE users
    ADD COLUMN avatar_url VARCHAR(512) NULL AFTER phone;
