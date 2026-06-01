-- Performance indexes for existing databases (run once; skip if index already exists)
USE pickleball_db;

-- users: email UNIQUE already provides a lookup index
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_role ON users (role);

CREATE INDEX idx_courts_status ON courts (status);

CREATE INDEX idx_bookings_court_date_status ON bookings (court_id, booking_date, booking_status);
CREATE INDEX idx_bookings_user_date ON bookings (user_id, booking_date);
CREATE INDEX idx_bookings_date_status ON bookings (booking_date, booking_status);

-- Optional cleanup: drop redundant index if it was created alongside UNIQUE(email)
-- ALTER TABLE users DROP INDEX idx_users_email;
