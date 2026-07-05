-- Cập nhật tọa độ GPS cho các Club (Mock data - khu vực Hà Nội & TP.HCM)
-- Hãy đảm bảo bạn ĐÃ KHỞI ĐỘNG LẠI BACKEND để Hibernate tự động tạo cột latitude và longitude trước khi chạy file này!

-- Club ID 1 - Khu vực Hồ Gươm, Hà Nội
UPDATE clubs SET latitude = 21.0285, longitude = 105.8542 WHERE id = 1;

-- Club ID 2 - Khu vực Đống Đa, Hà Nội
UPDATE clubs SET latitude = 21.0245, longitude = 105.8412 WHERE id = 2;

-- Club ID 3 - Khu vực Cầu Giấy, Hà Nội
UPDATE clubs SET latitude = 21.0311, longitude = 105.7988 WHERE id = 3;

-- Club ID 4 - Khu vực Quận 1, TP.HCM
UPDATE clubs SET latitude = 10.7769, longitude = 106.7009 WHERE id = 4;

-- Club ID 5 - Khu vực Quận 3, TP.HCM
UPDATE clubs SET latitude = 10.7751, longitude = 106.6880 WHERE id = 5;

-- Nếu có nhiều club hơn, hãy thêm dòng tương tự bên dưới với ID tương ứng
-- UPDATE clubs SET latitude = <lat>, longitude = <lng> WHERE id = <id>;
