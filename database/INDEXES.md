# Database indexes

Indexes are declared on JPA entities (`@Table(indexes = ...)`) and mirrored in `db-init.sql` / migrations.

| Table | Index | Purpose |
|-------|--------|---------|
| `users` | `UNIQUE(email)` | Login / lookup by email |
| `users` | `(status)` | Filter active accounts |
| `users` | `(role)` | Admin listings |
| `courts` | `(name)` | Search / sort by name |
| `courts` | `(status)` | List bookable courts (`ACTIVE`) |
| `bookings` | `(court_id, booking_date, booking_status)` | Schedule, overlap checks |
| `bookings` | `(user_id, booking_date)` | My bookings history |
| `bookings` | `(booking_date, booking_status)` | Dashboard statistics |
| `schedule_locks` | `(court_id, lock_date)` | Daily / weekly schedule |

Foreign keys on `bookings.user_id` and `bookings.court_id` are covered by composite indexes above.
