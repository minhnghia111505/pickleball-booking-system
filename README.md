# Pickleball Booking System

Hệ thống quản lý và đặt sân Pickleball — Fullstack Project (Modular Monolith) ứng dụng kiến trúc Multi-Tenant SaaS.

## 📁 Cấu trúc dự án

```
pickleball-booking-system/
├── backend/          # API Server (Spring Boot 3)
├── frontend/         # Client Web (Next.js App Router)
├── docs/             # Tài liệu dự án
├── database/         # Các script SQL khởi tạo Database
└── README.md
```

---

## 🛠 Tech Stack

- **Backend:** Java 21, Spring Boot 3, Maven, Spring Security (JWT), Spring Data JPA, MySQL 8+.
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Zustand, Axios, TanStack Query.

---

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Local Development)

### 1. Yêu cầu hệ thống
- **Java:** JDK 21+
- **Node.js:** v18.17+ (Khuyến nghị dùng v20 LTS)
- **Database:** MySQL 8.0+
- **Tooling:** Maven 3.9+

### 2. Thiết lập Cơ sở dữ liệu (MySQL)
Dự án đã có sẵn file script tạo bảng và chèn dữ liệu mẫu (mock data).
Mở terminal hoặc trình quản lý MySQL của bạn và chạy lệnh sau:
```bash
mysql -u root -p < database/db-init.sql
```
*Script này sẽ tạo database `pickleball_db`, các bảng (clubs, users, courts, bookings, services,...) và thêm sẵn các tài khoản/sân mẫu.*

### 3. Thiết lập Backend (Spring Boot)
Di chuyển vào thư mục `backend`:
```bash
cd backend
```
Copy file cấu hình môi trường và tuỳ chỉnh (đặc biệt là mật khẩu MySQL nếu bạn không dùng mặc định):
```bash
cp .env.example .env
```
Cài đặt dependencies và chạy server:
```bash
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend sẽ khởi chạy tại: `http://localhost:8080` (API endpoint gốc là `http://localhost:8080/api`)

### 4. Thiết lập Frontend (Next.js)
Mở một terminal mới và di chuyển vào thư mục `frontend`:
```bash
cd frontend
```
Copy file biến môi trường:
```bash
cp .env.example .env.local
```
*(Lưu ý: Đảm bảo `NEXT_PUBLIC_API_URL` trong `.env.local` trỏ đúng vào Backend `http://localhost:8080/api`)*

Cài đặt các thư viện Node.js và chạy dev server:
```bash
npm install
npm run dev
```
Frontend Client sẽ khởi chạy tại: `http://localhost:3000`

---

## 🔑 Tài khoản Test (Mock Data)

Tất cả các tài khoản mặc định đều có mật khẩu là: **`123456`**

- **Khách hàng (User):** `khachhang1@gmail.com`
- **Chủ sân (Manager - Club Master):** `manager_master@sanbong.vn`
- **Nhân viên (Staff - Club Master):** `staff_master@sanbong.vn`
- **Super Admin Nền tảng:** `superadmin@sanbong.vn`

---

## 📖 Tài liệu thêm

- Xem chi tiết bối cảnh dự án và kiến trúc tại [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)
- Để biết về các API Endpoint hiện có, xem phần Document của Spring Boot (Swagger nếu được cấu hình) hoặc đọc code tại package `com.pickleball.backend.modules.*.controller`.
