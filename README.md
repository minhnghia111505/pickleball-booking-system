# Pickleball Booking System

Hệ thống quản lý và đặt sân Pickleball — fullstack project (Modular Monolith).

## Cấu trúc dự án

```
pickleball-booking-system/
├── backend/          # Spring Boot 3 API
├── frontend/         # Frontend (sẽ bổ sung)
├── docs/             # Tài liệu
├── database/         # SQL scripts
└── README.md
```

## Tech Stack

- **Backend:** Spring Boot 3, Java 21, Maven, MySQL, JPA, Spring Security JWT
- **Frontend:** (placeholder)

## Quick Start (Backend)

### Yêu cầu

- JDK 21
- Maven 3.9+
- MySQL 8+

### Cài đặt

```bash
# 1. Tạo database
mysql -u root -p < database/db-init.sql

# 2. Cấu hình môi trường
cp backend/.env.example backend/.env
# Chỉnh sửa backend/.env theo môi trường local

# 3. Chạy backend
cd backend
mvn spring-boot:run
```

API chạy tại: `http://localhost:8080/api`

## Tài liệu

Xem [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) để hiểu kiến trúc và quy ước code.

## Modules

| Module       | Chức năng              |
|--------------|------------------------|
| auth         | Xác thực JWT           |
| user         | Quản lý người dùng     |
| court        | Quản lý sân            |
| schedule     | Lịch / khung giờ       |
| booking      | Đặt sân                |
| statistics   | Thống kê               |
