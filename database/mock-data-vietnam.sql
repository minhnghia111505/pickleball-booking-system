SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Sinh dữ liệu mẫu: Câu lạc bộ và Sân Pickleball tại HÀ NỘI
-- ==========================================
-- 1. XÓA DỮ LIỆU CŨ ĐỂ SỬA LỖI HÌNH ẢNH
-- ==========================================
DELETE FROM courts;
DELETE FROM clubs;
ALTER TABLE courts AUTO_INCREMENT = 1;
ALTER TABLE clubs AUTO_INCREMENT = 1;

-- ==========================================
-- 2. THÊM CÂU LẠC BỘ (CLUBS) TẠI HÀ NỘI
-- ==========================================
INSERT INTO clubs (id, name, address, phone, email, description, latitude, longitude, opening_time, closing_time, status, created_at, updated_at) VALUES 
(11, 'Pickleball Cầu Giấy', 'Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '0901234567', 'caugiay@pickleball.vn', 'Cụm sân chuẩn quốc tế khu vực Cầu Giấy, không gian thoáng mát.', 21.0341, 105.7925, '06:00:00', '22:00:00', 'ACTIVE', NOW(), NOW()),
(12, 'Pickleball Hồ Tây', 'Trích Sài, Tây Hồ, Hà Nội', '0912345678', 'hotay@pickleball.vn', 'Sân chơi view Hồ Tây cực chill, gió mát mẻ, mặt sân chuẩn.', 21.0456, 105.8164, '05:30:00', '23:00:00', 'ACTIVE', NOW(), NOW()),
(13, 'Pickleball Bách Khoa', 'Tạ Quang Bửu, Bách Khoa, Hai Bà Trưng, Hà Nội', '0923456789', 'bachkhoa@pickleball.vn', 'Nằm trong khu vực sinh viên, giá cả phải chăng, sân luôn đông vui.', 21.0041, 105.8456, '06:00:00', '22:00:00', 'ACTIVE', NOW(), NOW()),
(14, 'Pickleball Long Biên', 'Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội', '0934567890', 'longbien@pickleball.vn', 'Câu lạc bộ có bãi đỗ xe rộng rãi nhất Hà Nội, thoáng mát.', 21.0383, 105.8752, '06:00:00', '23:00:00', 'ACTIVE', NOW(), NOW()),
(15, 'Pickleball Hà Đông', 'Vạn Phúc, Hà Đông, Hà Nội', '0945678901', 'hadong@pickleball.vn', 'Khu thể thao cao cấp nằm sát Làng lụa Vạn Phúc.', 20.9754, 105.7725, '07:00:00', '22:00:00', 'ACTIVE', NOW(), NOW()),
(16, 'Pickleball Mỹ Đình', 'Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội', '0956789012', 'mydinh@pickleball.vn', 'Nằm sát sân vận động Mỹ Đình, cụm 6 sân chất lượng cao.', 21.0261, 105.7661, '05:30:00', '21:00:00', 'ACTIVE', NOW(), NOW());

-- ==========================================
-- 3. THÊM SÂN (COURTS) SỬ DỤNG ẢNH TỪ PICSUM PHOTOS (Cực kỳ ổn định)
-- ==========================================
-- Cầu Giấy
INSERT INTO courts (club_id, name, address, description, price_per_hour, status, image_url, created_at, updated_at) VALUES 
(11, 'Sân CG 01 (Có mái che)', 'Trần Thái Tông, Cầu Giấy', 'Sân số 1 có mái che, chống mưa nắng.', 150000, 'ACTIVE', 'https://picsum.photos/seed/court1/800/400', NOW(), NOW()),
(11, 'Sân CG 02 (Ngoài trời)', 'Trần Thái Tông, Cầu Giấy', 'Sân ngoài trời thoáng đãng, đèn LED 1000W.', 120000, 'ACTIVE', 'https://picsum.photos/seed/court2/800/400', NOW(), NOW()),
(11, 'Sân CG 03 (Ngoài trời)', 'Trần Thái Tông, Cầu Giấy', 'Sân ngoài trời thoáng đãng.', 120000, 'MAINTENANCE', 'https://picsum.photos/seed/court3/800/400', NOW(), NOW());

-- Hồ Tây
INSERT INTO courts (club_id, name, address, description, price_per_hour, status, image_url, created_at, updated_at) VALUES 
(12, 'Sân Hồ Tây VIP 1', 'Trích Sài, Tây Hồ', 'Sân sát mặt hồ, thảm trải chuẩn thi đấu.', 200000, 'ACTIVE', 'https://picsum.photos/seed/court4/800/400', NOW(), NOW()),
(12, 'Sân Hồ Tây 2', 'Trích Sài, Tây Hồ', 'Mặt sân nhám tốt, độ nảy bóng chuẩn.', 180000, 'ACTIVE', 'https://picsum.photos/seed/court5/800/400', NOW(), NOW());

-- Bách Khoa
INSERT INTO courts (club_id, name, address, description, price_per_hour, status, image_url, created_at, updated_at) VALUES 
(13, 'Sân BK Sinh Viên 1', 'Tạ Quang Bửu, HBT', 'Giá ưu đãi, mặt sân bê tông sơn chuyên dụng.', 80000, 'ACTIVE', 'https://picsum.photos/seed/court6/800/400', NOW(), NOW()),
(13, 'Sân BK Sinh Viên 2', 'Tạ Quang Bửu, HBT', 'Cạnh căng tin, tiện mua nước.', 80000, 'ACTIVE', 'https://picsum.photos/seed/court7/800/400', NOW(), NOW()),
(13, 'Sân BK Thi đấu', 'Tạ Quang Bửu, HBT', 'Dành riêng cho tổ chức giải, thảm chuẩn cao su.', 120000, 'ACTIVE', 'https://picsum.photos/seed/court8/800/400', NOW(), NOW());

-- Long Biên
INSERT INTO courts (club_id, name, address, description, price_per_hour, status, image_url, created_at, updated_at) VALUES 
(14, 'Sân Long Biên A', 'Nguyễn Văn Cừ, Long Biên', 'Không gian yên tĩnh, cực kỳ rộng.', 150000, 'ACTIVE', 'https://picsum.photos/seed/court9/800/400', NOW(), NOW()),
(14, 'Sân Long Biên B', 'Nguyễn Văn Cừ, Long Biên', 'Thường xuyên có gió sông Hồng mát mẻ.', 150000, 'ACTIVE', 'https://picsum.photos/seed/court10/800/400', NOW(), NOW());

-- Hà Đông
INSERT INTO courts (club_id, name, address, description, price_per_hour, status, image_url, created_at, updated_at) VALUES 
(15, 'Sân Lụa Vạn Phúc', 'Vạn Phúc, Hà Đông', 'Thiết kế đẹp mắt, thảm 7 lớp.', 160000, 'ACTIVE', 'https://picsum.photos/seed/court11/800/400', NOW(), NOW()),
(15, 'Sân AEON Hà Đông', 'Dương Nội, Hà Đông', 'Cạnh đại siêu thị AEON.', 160000, 'ACTIVE', 'https://picsum.photos/seed/court12/800/400', NOW(), NOW());

-- Mỹ Đình
INSERT INTO courts (club_id, name, address, description, price_per_hour, status, image_url, created_at, updated_at) VALUES 
(16, 'Sân Mỹ Đình 1', 'Lê Đức Thọ, Nam Từ Liêm', 'Nằm trong cụm liên hiệp thể thao.', 180000, 'ACTIVE', 'https://picsum.photos/seed/court13/800/400', NOW(), NOW()),
(16, 'Sân Mỹ Đình 2', 'Lê Đức Thọ, Nam Từ Liêm', 'Đèn siêu sáng, chuyên dùng quay giải đấu.', 180000, 'ACTIVE', 'https://picsum.photos/seed/court14/800/400', NOW(), NOW()),
(16, 'Sân Mỹ Đình VIP', 'Lê Đức Thọ, Nam Từ Liêm', 'Sân độc lập, không gian riêng tư.', 250000, 'ACTIVE', 'https://picsum.photos/seed/court15/800/400', NOW(), NOW());
