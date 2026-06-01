-- Run on existing databases when upgrading without schedule_locks table
USE pickleball_db;

CREATE TABLE IF NOT EXISTS schedule_locks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    court_id    BIGINT       NOT NULL,
    lock_date   DATE         NOT NULL,
    start_time  TIME(6)      NOT NULL,
    end_time    TIME(6)      NOT NULL,
    lock_type   VARCHAR(20)  NOT NULL,
    reason      VARCHAR(500),
    created_at  DATETIME(6)  NOT NULL,
    updated_at  DATETIME(6)  NOT NULL,
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255),
    CONSTRAINT fk_schedule_locks_court FOREIGN KEY (court_id) REFERENCES courts (id)
);

CREATE INDEX idx_schedule_locks_court_date ON schedule_locks (court_id, lock_date);
