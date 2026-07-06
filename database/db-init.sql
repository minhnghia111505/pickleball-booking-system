-- Pickleball Booking System - Database initialization
SET NAMES utf8mb4;
-- Multi-Tenant SaaS Architecture

DROP DATABASE IF EXISTS pickleball_db;
CREATE DATABASE pickleball_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pickleball_db;

-- 1. CLUBS (Câu lạc bộ/Cơ sở)
CREATE TABLE IF NOT EXISTS clubs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    address         VARCHAR(500) NOT NULL,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    description     TEXT,
    logo_url        VARCHAR(512),
    google_map_url  VARCHAR(1000),
    rating          DOUBLE,
    reviews_count   INT,
    latitude        DOUBLE,
    longitude       DOUBLE,
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    opening_time    TIME(6)      NOT NULL DEFAULT '06:00:00',
    closing_time    TIME(6)      NOT NULL DEFAULT '22:00:00',
    created_at      DATETIME(6)  NOT NULL,
    updated_at      DATETIME(6)  NOT NULL,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- 2. USERS (Người dùng, bao gồm cả Khách hàng, Nhân viên, Chủ sân, Super Admin)
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id     BIGINT, -- NULL for ROLE_USER and ROLE_SUPER_ADMIN
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    avatar_url  VARCHAR(512),
    role        VARCHAR(30)  NOT NULL, -- ROLE_SUPER_ADMIN, ROLE_MANAGER, ROLE_STAFF, ROLE_USER
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at  DATETIME(6)  NOT NULL,
    updated_at  DATETIME(6)  NOT NULL,
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255),
    CONSTRAINT fk_users_club FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE SET NULL
);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_club ON users (club_id);

-- 3. COURTS (Sân)
CREATE TABLE IF NOT EXISTS courts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id         BIGINT         NOT NULL,
    name            VARCHAR(200)   NOT NULL,
    description     TEXT,
    price_per_hour  DECIMAL(10, 2) NOT NULL,
    status          VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    image_url       VARCHAR(512),
    created_at      DATETIME(6)    NOT NULL,
    updated_at      DATETIME(6)    NOT NULL,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255),
    CONSTRAINT fk_courts_club FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE CASCADE
);
CREATE INDEX idx_courts_club ON courts (club_id);
CREATE INDEX idx_courts_status ON courts (status);

-- 4. BOOKINGS (Đặt sân)
CREATE TABLE IF NOT EXISTS bookings (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id           BIGINT         NOT NULL, -- To easily query revenue per club
    user_id           BIGINT         NOT NULL,
    court_id          BIGINT         NOT NULL,
    booking_date      DATE           NOT NULL,
    start_time        TIME(6)        NOT NULL,
    end_time          TIME(6)        NOT NULL,
    booking_status    VARCHAR(20)    NOT NULL, -- PENDING, CONFIRMED, COMPLETED, CANCELLED
    total_amount      DECIMAL(12, 2),
    payment_status    VARCHAR(20),             -- UNPAID, PAID, REFUNDED
    payment_reference VARCHAR(255),
    created_at        DATETIME(6)    NOT NULL,
    updated_at        DATETIME(6)    NOT NULL,
    created_by        VARCHAR(255),
    updated_by        VARCHAR(255),
    CONSTRAINT fk_bookings_club FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_court FOREIGN KEY (court_id) REFERENCES courts (id) ON DELETE CASCADE
);
CREATE INDEX idx_bookings_club_date ON bookings (club_id, booking_date);
CREATE INDEX idx_bookings_court_date_status ON bookings (court_id, booking_date, booking_status);
CREATE INDEX idx_bookings_user_date ON bookings (user_id, booking_date);

-- 5. SCHEDULE_LOCKS (Khóa sân/Bảo trì)
CREATE TABLE IF NOT EXISTS schedule_locks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    court_id    BIGINT       NOT NULL,
    lock_date   DATE         NOT NULL,
    start_time  TIME(6)      NOT NULL,
    end_time    TIME(6)      NOT NULL,
    lock_type   VARCHAR(20)  NOT NULL, -- MAINTENANCE, TOURNAMENT
    reason      VARCHAR(500),
    created_at  DATETIME(6)  NOT NULL,
    updated_at  DATETIME(6)  NOT NULL,
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255),
    CONSTRAINT fk_schedule_locks_court FOREIGN KEY (court_id) REFERENCES courts (id) ON DELETE CASCADE
);
CREATE INDEX idx_schedule_locks_court_date ON schedule_locks (court_id, lock_date);

-- 6. SERVICES (Nước uống, cho thuê vợt)
CREATE TABLE IF NOT EXISTS services (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id     BIGINT         NOT NULL,
    name        VARCHAR(200)   NOT NULL,
    type        VARCHAR(50)    NOT NULL, -- WATER, RENTAL_EQUIPMENT, SNACK
    price       DECIMAL(10, 2) NOT NULL,
    status      VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    image_url   VARCHAR(512),
    created_at  DATETIME(6)    NOT NULL,
    updated_at  DATETIME(6)    NOT NULL,
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255),
    CONSTRAINT fk_services_club FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE CASCADE
);

-- 7. BOOKING_SERVICES (Dịch vụ khách đã đặt kèm booking)
CREATE TABLE IF NOT EXISTS booking_services (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id  BIGINT         NOT NULL,
    service_id  BIGINT         NOT NULL,
    quantity    INT            NOT NULL,
    unit_price  DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at  DATETIME(6)    NOT NULL,
    CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE,
    CONSTRAINT fk_bs_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
);

-- =========================================================================
-- MOCK DATA (Chèn dữ liệu mẫu để thuận tiện việc test)
-- Mật khẩu mặc định là mã hóa BCrypt của '123456' ($2a$10$HlL.1HY2vj1vQLtGTu4gyuSMovUExOjZhiLJAC2wLPKaoF5lTU7yi)
-- =========================================================================

-- 1. MOCK CLUBS
INSERT INTO clubs (name, address, phone, email, description, status, opening_time, closing_time, created_at, updated_at) VALUES 
('Pickleball Master Club', '123 Cầu Giấy, Hà Nội', '0988111222', 'contact@masterclub.com', 'Tổ hợp 4 sân Pickleball chuẩn quốc tế có mái che.', 'ACTIVE', '06:00:00', '22:00:00', NOW(), NOW()),
('Sunrise Pickleball', '456 Nguyễn Hữu Thọ, Quận 7, TP.HCM', '0977333444', 'hello@sunrisepb.com', 'Sân chơi ngoài trời thoáng mát, không gian mở.', 'ACTIVE', '05:00:00', '23:00:00', NOW(), NOW());

-- 2. MOCK USERS
-- Super Admin (Không thuộc Club nào)
INSERT INTO users (club_id, email, password, full_name, phone, role, status, created_at, updated_at) VALUES 
(NULL, 'superadmin@sanbong.vn', '$2a$10$HlL.1HY2vj1vQLtGTu4gyuSMovUExOjZhiLJAC2wLPKaoF5lTU7yi', 'Super Admin Nền Tảng', '0900000000', 'ROLE_SUPER_ADMIN', 'ACTIVE', NOW(), NOW());

-- Manager (Chủ sân) cho Club 1 và Club 2
INSERT INTO users (club_id, email, password, full_name, phone, role, status, created_at, updated_at) VALUES 
(1, 'manager_master@sanbong.vn', '$2a$10$HlL.1HY2vj1vQLtGTu4gyuSMovUExOjZhiLJAC2wLPKaoF5lTU7yi', 'Chủ sân Master', '0911111111', 'ROLE_MANAGER', 'ACTIVE', NOW(), NOW()),
(2, 'manager_sunrise@sanbong.vn', '$2a$10$HlL.1HY2vj1vQLtGTu4gyuSMovUExOjZhiLJAC2wLPKaoF5lTU7yi', 'Chủ sân Sunrise', '0922222222', 'ROLE_MANAGER', 'ACTIVE', NOW(), NOW());

-- Staff (Nhân viên) cho Club 1
INSERT INTO users (club_id, email, password, full_name, phone, role, status, created_at, updated_at) VALUES 
(1, 'staff_master@sanbong.vn', '$2a$10$HlL.1HY2vj1vQLtGTu4gyuSMovUExOjZhiLJAC2wLPKaoF5lTU7yi', 'Nhân viên Master', '0933333333', 'ROLE_STAFF', 'ACTIVE', NOW(), NOW());

-- User (Khách hàng)
INSERT INTO users (club_id, email, password, full_name, phone, role, status, created_at, updated_at) VALUES 
(NULL, 'khachhang1@gmail.com', '$2a$10$HlL.1HY2vj1vQLtGTu4gyuSMovUExOjZhiLJAC2wLPKaoF5lTU7yi', 'Nguyễn Văn Khách', '0944444444', 'ROLE_USER', 'ACTIVE', NOW(), NOW());

-- 3. MOCK COURTS
-- Club 1 (Master)
INSERT INTO courts (club_id, name, description, price_per_hour, status, created_at, updated_at) VALUES 
(1, 'Sân Master 1 (Trong nhà)', 'Sân chuẩn, có mái che, thảm xịn', 120000, 'ACTIVE', NOW(), NOW()),
(1, 'Sân Master 2 (Trong nhà)', 'Sân chuẩn, có mái che', 120000, 'ACTIVE', NOW(), NOW()),
(1, 'Sân Master 3 (Ngoài trời)', 'Sân thoáng mát, có đèn LED đêm', 100000, 'ACTIVE', NOW(), NOW());

-- Club 2 (Sunrise)
INSERT INTO courts (club_id, name, description, price_per_hour, status, created_at, updated_at) VALUES 
(2, 'Sân Sunrise A', 'Sân ngoài trời', 90000, 'ACTIVE', NOW(), NOW()),
(2, 'Sân Sunrise B', 'Sân ngoài trời', 90000, 'ACTIVE', NOW(), NOW());

-- 4. MOCK SERVICES
-- Club 1 (Master)
INSERT INTO services (club_id, name, type, price, status, created_at, updated_at) VALUES 
(1, 'Nước khoáng Revive', 'WATER', 15000, 'ACTIVE', NOW(), NOW()),
(1, 'Thuê Vợt Selkirk', 'RENTAL_EQUIPMENT', 50000, 'ACTIVE', NOW(), NOW()),
(1, 'Bóng Pickleball (Hộp 3 quả)', 'RENTAL_EQUIPMENT', 30000, 'ACTIVE', NOW(), NOW());
