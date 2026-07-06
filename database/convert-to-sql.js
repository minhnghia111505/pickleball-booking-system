const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'crawled-courts.json.json');
const sqlFilePath = path.join(__dirname, 'real-data-vietnam.sql');

console.log('Bắt đầu đọc file JSON...');

try {
  const rawData = fs.readFileSync(jsonFilePath, 'utf8');
  const courtsData = JSON.parse(rawData);

  console.log('Đã tìm thấy ' + courtsData.length + ' sân trong file JSON.');

  let sqlContent = "SET NAMES utf8mb4;\nSET CHARACTER SET utf8mb4;\n\n";
  sqlContent += "DELETE FROM courts;\nDELETE FROM clubs;\nALTER TABLE courts AUTO_INCREMENT = 1;\nALTER TABLE clubs AUTO_INCREMENT = 1;\n\n";
  sqlContent += "INSERT INTO clubs (name, address, phone, email, description, latitude, longitude, logo_url, google_map_url, rating, reviews_count, opening_time, closing_time, status, created_at, updated_at) VALUES \n";

  const clubValues = [];
  const courtsInsertStatements = [];

  courtsData.forEach((club, index) => {
    const name = (club.title || 'Sân Pickleball chưa có tên').replace(/'/g, "''");
    let address = (club.address || club.street || 'Chưa cập nhật địa chỉ').replace(/'/g, "''");
    if (address.length > 500) address = address.substring(0, 497) + '...';
    
    let phone = club.phone || club.phoneUnformatted || '';
    if (phone.length > 20) phone = phone.substring(0, 20);

    const lat = (club.location && club.location.lat) ? club.location.lat : 0;
    const lng = (club.location && club.location.lng) ? club.location.lng : 0;
    const score = club.totalScore || 0;
    const reviews = club.reviewsCount || 0;
    let mapUrl = club.url || '';
    if (mapUrl.length > 1000) mapUrl = mapUrl.substring(0, 997) + '...';

    const email = 'contact' + index + '@' + name.replace(/\s+/g, '').toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const finalEmail = email.substring(0, 50);
    const description = 'Sân Pickleball được cập nhật từ Google Maps.';

    // Lấy ảnh thật từ Google Maps
    let realImage = club.imageUrl || 'https://picsum.photos/seed/' + index + '/800/400';
    if (realImage.length > 512) realImage = realImage.substring(0, 510);

    clubValues.push("('" + name + "', '" + address + "', '" + phone + "', '" + finalEmail + "', '" + description + "', " + lat + ", " + lng + ", '" + realImage + "', '" + mapUrl + "', " + score + ", " + reviews + ", '06:00:00', '22:00:00', 'ACTIVE', NOW(), NOW())");

    const courtName = ('Sân chính - ' + name).substring(0, 200).replace(/'/g, "''");
    const price = 100000 + (Math.floor(Math.random() * 3) * 50000);
    
    courtsInsertStatements.push(
      "(" + (index + 1) + ", '" + courtName + "', '" + address + "', 'Sân đạt tiêu chuẩn.', " + price + ", 'ACTIVE', '" + realImage + "', NOW(), NOW())"
    );
  });

  sqlContent += clubValues.join(',\n') + ';\n\n';

  sqlContent += "-- 2. THÊM SÂN (COURTS) CHO CÁC CÂU LẠC BỘ\n";
  sqlContent += "INSERT INTO courts (club_id, name, address, description, price_per_hour, status, image_url, created_at, updated_at) VALUES \n";
  sqlContent += courtsInsertStatements.join(',\n') + ';\n';

  fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
  console.log('✅ Chuyển đổi thành công! Đã bổ sung URL, Rating và Reviews Count.');
  console.log('👉 File SQL đã được lưu tại:', sqlFilePath);

} catch (error) {
  console.error('Đã xảy ra lỗi:', error);
}
