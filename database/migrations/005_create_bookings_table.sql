-- Run on existing databases when upgrading without bookings table
USE pickleball_db;

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
