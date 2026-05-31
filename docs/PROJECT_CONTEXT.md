# Project Context — Pickleball Booking System

## Overview

Hệ thống quản lý và đặt sân Pickleball. Dự án fullstack dạng **Modular Monolith**, phù hợp đồ án sinh viên và dễ mở rộng sau này.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Spring Boot 3, Java 21, Maven       |
| Database | MySQL                               |
| Auth     | Spring Security + JWT               |
| ORM      | Spring Data JPA                     |
| Frontend | (sẽ bổ sung sau)                    |

## Root Structure

```
pickleball-booking-system/
├── backend/     # Spring Boot API
├── frontend/    # Client app (placeholder)
├── docs/        # Tài liệu dự án
├── database/    # SQL scripts
└── README.md
```

## Backend Architecture

Package root: `com.pickleball.backend`

```
backend/src/main/java/com/pickleball/backend/
├── config/       # Cấu hình Spring (Security, CORS, JPA...)
├── security/     # JWT filter, auth helpers
├── exception/    # Custom exceptions + global handler
├── response/     # ApiResponse, PageResponse wrappers
├── util/         # Utility classes
├── modules/      # Business modules (feature-based)
│   ├── auth/
│   ├── user/
│   ├── court/
│   ├── booking/
│   ├── schedule/
│   └── statistics/
└── PickleballBackendApplication.java
```

### Module Structure (mỗi module)

```
modules/{name}/
├── controller/   # REST endpoints
├── service/      # Business logic
├── repository/   # JPA repositories
├── entity/       # JPA entities
├── dto/          # Request/Response DTOs
└── mapper/       # Entity ↔ DTO mapping
```

## Module Responsibilities

| Module       | Mô tả ngắn                                      |
|--------------|--------------------------------------------------|
| `auth`       | Đăng ký, đăng nhập, refresh token               |
| `user`       | Quản lý profile, phân quyền user                |
| `court`      | CRUD sân, trạng thái sân                        |
| `schedule`   | Khung giờ hoạt động / lịch mở sân               |
| `booking`    | Đặt sân, hủy, trạng thái booking                |
| `statistics` | Thống kê doanh thu, tỷ lệ sử dụng sân           |

## Conventions

- API prefix: `/api` (cấu hình trong `application.yml`)
- Response format thống nhất qua `response/ApiResponse`
- Exception xử lý tập trung tại `exception/GlobalExceptionHandler`
- Biến môi trường: copy `backend/.env.example` → `.env`
- Database init: chạy `database/db-init.sql` trước khi start backend

## Development Flow (gợi ý)

1. Entity + Repository
2. Service (business rules)
3. DTO + Mapper
4. Controller (REST API)
5. Security rules (nếu cần)

## AI Coding Notes

- Mỗi module độc lập — AI có thể làm việc trên từng module mà không ảnh hưởng module khác
- Folder depth tối đa ~4 cấp trong `modules/` — dễ navigate
- Không dùng microservices — đủ cho đồ án, deploy đơn giản
