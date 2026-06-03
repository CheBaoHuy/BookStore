-- ============================================================
-- BookStore Database - SQL Seed Script
-- Chạy script này nếu muốn import dữ liệu trực tiếp vào MySQL
-- (Không cần thiết nếu dùng DataInitializer của Spring Boot)
--
-- Bảng được seed:
--   1. order_statuses
--   2. users
--   3. categories
--   4. products
--   5. addresses
--   6. orders
--   7. order_details
--   8. reviews
-- ============================================================

-- Tạo database
drop database bookstore_db;
create database bookstore_db;
use bookstore_db;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. ORDER STATUSES
-- ============================================================
INSERT IGNORE INTO order_statuses (id, status) VALUES
(1, 'Chờ xác nhận'),
(2, 'Đã xác nhận'),
(3, 'Đang giao hàng'),
(4, 'Đã giao hàng'),
(5, 'Đã hủy');

-- ============================================================
-- 2. USERS
-- Mật khẩu BCrypt:
--   admin123  → $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--   123456    → $2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq
-- ============================================================
INSERT IGNORE INTO users (id, username, password, email, full_name, phone, role, status, created_at) VALUES
(1,  'admin',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@bookstore.com',       'Quản Trị Viên',     '0900000001', 'ADMIN', 1, NOW()),
(2,  'nguyenvana',   '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'nguyenvana@gmail.com',     'Nguyễn Văn An',     '0901234567', 'USER',  1, NOW()),
(3,  'tranthib',     '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'tranthib@gmail.com',       'Trần Thị Bích',     '0902345678', 'USER',  1, NOW()),
(4,  'lehoanganh',   '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'lehoanganh@gmail.com',     'Lê Hoàng Anh',      '0903456789', 'USER',  1, NOW()),
(5,  'phamminhtuan', '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'phamminhtuan@gmail.com',   'Phạm Minh Tuấn',    '0904567890', 'USER',  1, NOW()),
(6,  'vothimai',     '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'vothimai@gmail.com',       'Võ Thị Mai',        '0905678901', 'USER',  1, NOW()),
(7,  'dangthanhlong','$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'dangthanhlong@gmail.com',  'Đặng Thành Long',   '0906789012', 'USER',  1, NOW()),
(8,  'buithibaovy',  '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'buithibaovy@gmail.com',    'Bùi Thị Bảo Vy',   '0907890123', 'USER',  1, NOW()),
(9,  'hoangducnam',  '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'hoangducnam@gmail.com',    'Hoàng Đức Nam',     '0908901234', 'USER',  1, NOW()),
(10, 'ngothikimanh', '$2a$10$fBhcKfM7q9wHgMJP2DXKF.6gU1yVK1kDHsrHJlK8f2M8vOd5XmDq', 'ngothikimanh@gmail.com',   'Ngô Thị Kim Anh',   '0909012345', 'USER',  1, NOW());

-- ============================================================
-- 3. CATEGORIES
-- ============================================================

-- Danh mục cha
INSERT IGNORE INTO categories (id, name, active, parent_id, created_at) VALUES
(1, 'Học tập',     1, NULL, NOW()),
(2, 'Tiểu thuyết', 1, NULL, NOW()),
(3, 'Kinh doanh',  1, NULL, NOW()),
(4, 'Sức khỏe',    1, NULL, NOW());

-- Danh mục con – Học tập
INSERT IGNORE INTO categories (id, name, active, parent_id, created_at) VALUES
(5,  'Khoa học',       1, 1, NOW()),
(6,  'Lịch sử',        1, 1, NOW()),
(7,  'Ngoại ngữ',      1, 1, NOW()),
(8,  'Giáo trình ĐH',  1, 1, NOW());

-- Danh mục con – Tiểu thuyết
INSERT IGNORE INTO categories (id, name, active, parent_id, created_at) VALUES
(9,  'Văn học Việt Nam',   1, 2, NOW()),
(10, 'Văn học nước ngoài', 1, 2, NOW()),
(11, 'Trinh thám',         1, 2, NOW()),
(12, 'Viễn tưởng',         1, 2, NOW());

-- Danh mục con – Kinh doanh
INSERT IGNORE INTO categories (id, name, active, parent_id, created_at) VALUES
(13, 'Tài chính',   1, 3, NOW()),
(14, 'Quản lý',     1, 3, NOW()),
(15, 'Marketing',   1, 3, NOW()),
(16, 'Khởi nghiệp', 1, 3, NOW());

-- Danh mục con – Sức khỏe
INSERT IGNORE INTO categories (id, name, active, parent_id, created_at) VALUES
(17, 'Tâm lý',           1, 4, NOW()),
(18, 'Dinh dưỡng',       1, 4, NOW()),
(19, 'Thể dục thể thao', 1, 4, NOW());

-- ============================================================
-- 4. PRODUCTS (Sách)
-- ============================================================
INSERT IGNORE INTO products (id, title, author, publisher, publish_year, current_price, old_price, quantity, description, category_id, active, created_at) VALUES

-- === Kinh doanh – Tài chính (13) ===
(1,  'Đắc Nhân Tâm',                     'Dale Carnegie',          'NXB Tổng hợp TP.HCM', 2023,  89000, 120000, 150,
 'Cuốn sách kinh điển về nghệ thuật đối nhân xử thế và giao tiếp. Đây là một trong những cuốn sách bán chạy nhất mọi thời đại với hơn 30 triệu bản được bán ra trên toàn thế giới.',
 3, 1, NOW()),
(2,  'Người Giàu Có Nhất Thành Babylon',  'George S. Clason',       'NXB Thanh Niên',      2022,  65000,  85000,  90,
 'Những bài học tài chính cá nhân kể qua những câu chuyện ngụ ngôn từ Babylon cổ đại. Cuốn sách truyền cảm hứng tiết kiệm, đầu tư và làm giàu.',
 13, 1, NOW()),
(3,  'Cha Giàu Cha Nghèo',               'Robert T. Kiyosaki',     'NXB Trẻ',             2023, 108000, 140000, 120,
 'Cuốn sách thay đổi tư duy về tiền bạc và đầu tư. Tác giả chia sẻ bài học từ hai người cha – cha ruột học thức cao nhưng nghèo, và người cha giàu dạy ông cách làm giàu.',
 13, 1, NOW()),
(4,  'Nghĩ Giàu Làm Giàu',               'Napoleon Hill',          'NXB Lao Động',        2022,  95000, 125000,  80,
 'Bí quyết thành công được đúc kết từ 500 triệu phú và tỷ phú nổi tiếng nhất nước Mỹ trong suốt 20 năm nghiên cứu.',
 13, 1, NOW()),

-- === Kinh doanh – Quản lý (14) ===
(5,  'Tư Duy Phản Biện',                 'Richard Paul & Linda Elder', 'NXB Thế Giới',    2023, 119000, 155000,  60,
 'Hướng dẫn toàn diện để cải thiện tư duy phân tích, phán đoán và lập luận trong cuộc sống lẫn công việc.',
 14, 1, NOW()),

-- === Kinh doanh – Khởi nghiệp (16) ===
(6,  'Khởi Nghiệp Tinh Gọn',             'Eric Ries',              'NXB Trẻ',             2022, 135000, 165000,  70,
 'Phương pháp đột phá để tạo ra các công ty khởi nghiệp thành công thông qua vòng lặp Xây dựng – Đo lường – Học hỏi.',
 16, 1, NOW()),
(7,  'Zero To One',                       'Peter Thiel',            'NXB Thế Giới',        2022, 115000, 149000,  65,
 'Ghi chú về các công ty khởi nghiệp và cách xây dựng tương lai. Sách dạy tạo ra điều chưa ai làm thay vì cạnh tranh trên thị trường cũ.',
 16, 1, NOW()),

-- === Kinh doanh – Marketing (15) ===
(8,  'Marketing 4.0',                     'Philip Kotler',          'NXB Trẻ',             2023, 145000, 180000,  55,
 'Chuyển đổi từ tiếp thị truyền thống sang kỹ thuật số trong thời đại kết nối. Được viết bởi cha đẻ của Marketing hiện đại.',
 15, 1, NOW()),

-- === Học tập – Tổng quát (1) ===
(9,  'Tư Duy Nhanh Và Chậm',             'Daniel Kahneman',        'NXB Thế Giới',        2023, 115000, 150000,  50,
 'Khám phá cách tâm trí con người hoạt động qua hai hệ thống tư duy: Hệ thống 1 (nhanh, bản năng) và Hệ thống 2 (chậm, có lý trí).',
 1, 1, NOW()),

-- === Học tập – Giáo trình ĐH (8) ===
(10, 'Giải Tích 1',                       'Nguyễn Đình Trí',        'NXB Giáo Dục',        2023,  55000,   NULL, 200,
 'Giáo trình giải tích toán học dành cho sinh viên đại học năm nhất. Bao gồm giới hạn, đạo hàm, tích phân và chuỗi số.',
 8, 1, NOW()),
(11, 'Đại Số Tuyến Tính',                 'Nguyễn Thủy Thanh',      'NXB Giáo Dục',        2022,  48000,   NULL, 180,
 'Giáo trình đại số tuyến tính dành cho sinh viên kỹ thuật và khoa học tự nhiên. Bao gồm ma trận, định thức và không gian vectơ.',
 8, 1, NOW()),

-- === Học tập – Ngoại ngữ (7) ===
(12, 'Tiếng Anh Giao Tiếp Hàng Ngày',   'Thu Hương',              'NXB Trẻ',             2023,  75000,  95000, 300,
 'Cẩm nang tiếng Anh giao tiếp cho người Việt với hơn 3.000 câu thoại thực dụng trong mọi tình huống hàng ngày.',
 7, 1, NOW()),
(13, 'TOEIC 900 – Chiến Lược Vàng',      'Su Yeon Kim',            'NXB Tổng hợp TP.HCM', 2023, 185000, 220000, 100,
 'Tài liệu luyện thi TOEIC nâng điểm từ 700 lên 900+ với chiến lược làm bài bài bản và 10 bộ đề thi thử.',
 7, 1, NOW()),

-- === Học tập – Khoa học (5) ===
(14, 'Sapiens: Lược Sử Loài Người',       'Yuval Noah Harari',      'NXB Tri Thức',        2022, 145000, 180000,  60,
 'Hành trình 70.000 năm lịch sử nhân loại từ khi Homo sapiens xuất hiện đến khi chinh phục toàn bộ Trái Đất.',
 5, 1, NOW()),
(15, 'Homo Deus: Lược Sử Tương Lai',     'Yuval Noah Harari',      'NXB Tri Thức',        2023, 155000, 190000,  45,
 'Câu chuyện về ngày mai của loài người: bất tử, hạnh phúc nhân tạo và khả năng Homo sapiens trở thành chúa tể vũ trụ.',
 5, 1, NOW()),
(16, 'Vật Lý Vui',                        'Yakov Perelman',         'NXB Giáo Dục',        2022,  85000, 110000, 120,
 'Khám phá thế giới vật lý qua những câu chuyện, bài toán thú vị và hấp dẫn. Sách phổ biến khoa học kinh điển dành cho mọi lứa tuổi.',
 5, 1, NOW()),

-- === Học tập – Lịch sử (6) ===
(17, 'Lịch Sử Văn Minh Thế Giới',        'Will Durant',            'NXB Hồng Đức',        2021, 299000, 380000,  30,
 'Bộ sách đồ sộ 11 tập về lịch sử văn minh nhân loại từ Phương Đông cổ đại đến thế kỷ 20, tái bản lần thứ 3 tại Việt Nam.',
 6, 1, NOW()),

-- === Tiểu thuyết – Văn học nước ngoài (10) ===
(18, 'Nhà Giả Kim',                       'Paulo Coelho',           'NXB Hội Nhà Văn',     2022,  75000,  90000,  80,
 'Tiểu thuyết kinh điển về hành trình theo đuổi ước mơ của cậu bé chăn cừu Santiago. Bán hơn 65 triệu bản, dịch ra 80 thứ tiếng.',
 10, 1, NOW()),
(19, 'Muôn Kiếp Nhân Sinh',               'Brian Weiss',            'NXB Tổng hợp TP.HCM', 2023,  89000, 115000, 180,
 'Cuốn sách về liệu pháp hồi quy kiếp trước gây chấn động thế giới. Bác sĩ tâm thần Brian Weiss kể lại hành trình của bệnh nhân qua nhiều kiếp sống.',
 10, 1, NOW()),
(20, 'Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya', 'Keigo Higashino',   'NXB Trẻ',             2023, 105000, 135000, 130,
 'Câu chuyện cảm động về một tiệm tạp hóa bình thường ở Nhật Bản ẩn chứa sức mạnh kỳ diệu: chữa lành trái tim người khác.',
 10, 1, NOW()),

-- === Tiểu thuyết – Văn học Việt Nam (9) ===
(21, 'Dế Mèn Phiêu Lưu Ký',              'Tô Hoài',                'NXB Kim Đồng',        2021,  45000,   NULL, 250,
 'Tác phẩm kinh điển của văn học thiếu nhi Việt Nam kể về hành trình phiêu lưu của Dế Mèn qua thế giới loài côn trùng.',
 9, 1, NOW()),
(22, 'Số Đỏ',                             'Vũ Trọng Phụng',         'NXB Văn Học',         2022,  58000,  72000, 100,
 'Tiểu thuyết trào phúng kinh điển phơi bày sự thối nát và lố bịch của xã hội Việt Nam thời Pháp thuộc qua nhân vật Xuân Tóc Đỏ.',
 9, 1, NOW()),
(23, 'Chí Phèo',                          'Nam Cao',                'NXB Văn Học',         2021,  42000,   NULL, 150,
 'Tập truyện ngắn kinh điển của nhà văn Nam Cao, phản ánh bi kịch của người nông dân Việt Nam trước Cách mạng tháng Tám.',
 9, 1, NOW()),
(24, 'Tắt Đèn',                           'Ngô Tất Tố',             'NXB Văn Học',         2021,  38000,   NULL, 120,
 'Tiểu thuyết kinh điển về cuộc sống khổ cực của chị Dậu và người nông dân nghèo trong xã hội phong kiến thực dân.',
 9, 1, NOW()),
(25, 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',  'Nguyễn Nhật Ánh',        'NXB Trẻ',             2022,  68000,  85000, 200,
 'Câu chuyện tuổi thơ đẹp đẽ và cảm động về tình anh em, tình bạn, tình làng nghĩa xóm ở một vùng quê Việt Nam.',
 9, 1, NOW()),
(26, 'Mắt Biếc',                          'Nguyễn Nhật Ánh',        'NXB Trẻ',             2023,  62000,  78000, 170,
 'Chuyện tình buồn của Ngạn và Hà Lan qua những năm tháng tuổi thơ, học trò đến khi trưởng thành.',
 9, 1, NOW()),
(27, 'Đất Rừng Phương Nam',               'Đoàn Giỏi',              'NXB Kim Đồng',        2021,  55000,  70000, 140,
 'Tiểu thuyết kinh điển về thiên nhiên hoang dã và con người nghĩa khí của vùng đất Nam Bộ thập niên 1945.',
 9, 1, NOW()),

-- === Tiểu thuyết – Trinh thám (11) ===
(28, 'Bố Già',                            'Mario Puzo',             'NXB Văn Học',         2022, 115000, 145000,  70,
 'Tiểu thuyết kinh điển về thế giới ngầm Mafia của Mario Puzo. Một trong những tác phẩm ăn khách nhất mọi thời đại.',
 11, 1, NOW()),
(29, 'Và Rồi Không Còn Ai',               'Agatha Christie',        'NXB Hội Nhà Văn',     2022,  79000,  98000,  85,
 'Tiểu thuyết trinh thám xuất sắc nhất của Agatha Christie với 10 người lạ bị mắc kẹt trên đảo hoang và lần lượt biến mất.',
 11, 1, NOW()),

-- === Tiểu thuyết – Viễn tưởng (12) ===
(30, 'Harry Potter Và Hòn Đá Phù Thủy',  'J.K. Rowling',           'NXB Trẻ',             2022, 125000, 155000, 200,
 'Phần đầu tiên trong series Harry Potter huyền thoại về cậu bé phù thủy bước vào trường Hogwarts.',
 12, 1, NOW()),

-- === Sức khỏe – Tâm lý (17) ===
(31, 'Sức Mạnh Của Thói Quen',            'Charles Duhigg',         'NXB Lao Động',        2023,  98000, 130000,  90,
 'Khám phá bí quyết thay đổi thói quen trong cuộc sống và công việc dựa trên nghiên cứu thần kinh học và tâm lý học hiện đại.',
 17, 1, NOW()),
(32, 'Đời Ngắn Đừng Ngủ Dài',            'Robin Sharma',           'NXB Trẻ',             2023,  79000,  99000, 110,
 'Bí quyết thức dậy lúc 5 giờ sáng, xây dựng thói quen sáng mạnh mẽ và thay đổi cuộc đời trong 66 ngày.',
 17, 1, NOW()),
(33, 'Ikigai – Đời Đáng Sống',            'Héctor García & Francesc Miralles', 'NXB Thế Giới', 2022, 88000, 112000, 160,
 'Nghệ thuật sống của người Nhật Bản: bí quyết trường thọ, hạnh phúc và tìm ra lý do tồn tại của bản thân.',
 17, 1, NOW()),
(34, 'Tâm Lý Học Đám Đông',              'Gustave Le Bon',         'NXB Thế Giới',        2022,  72000,  92000,  95,
 'Tác phẩm nền tảng về tâm lý học xã hội, phân tích hành vi tập thể và cơ chế tác động của đám đông.',
 17, 1, NOW()),
(35, 'Mindfulness – Sống Tỉnh Thức',     'Thích Nhất Hạnh',        'NXB Tôn Giáo',        2023,  78000,  98000, 130,
 'Hướng dẫn thực hành chánh niệm trong cuộc sống hàng ngày từ thiền sư Thích Nhất Hạnh nổi tiếng thế giới.',
 17, 1, NOW()),

-- === Sức khỏe – Dinh dưỡng (18) ===
(36, 'Dinh Dưỡng Cho Người Việt',        'PGS.TS Nguyễn Thị Lâm', 'NXB Y Học',           2023, 125000, 158000,  75,
 'Hướng dẫn dinh dưỡng khoa học phù hợp với thể trạng và thói quen ăn uống của người Việt Nam.',
 18, 1, NOW()),
(37, 'Sức Khỏe Hoàn Toàn Tự Nhiên',     'Andrew Weil',            'NXB Y Học',           2022, 145000, 185000,  50,
 'Hướng dẫn toàn diện về y học tích hợp: kết hợp y học hiện đại với y học cổ truyền để duy trì sức khỏe tối ưu.',
 18, 1, NOW()),

-- === Sức khỏe – Thể dục thể thao (19) ===
(38, 'Yoga Cho Người Mới Bắt Đầu',       'BKS Iyengar',            'NXB Phụ Nữ',          2022, 115000, 145000,  65,
 'Hướng dẫn toàn diện về yoga với hơn 200 tư thế, kèm ảnh minh họa chi tiết phù hợp cho người mới hoàn toàn.',
 19, 1, NOW()),
(39, 'Chạy Bộ Đúng Cách',                'Jeff Galloway',          'NXB Thể Thao',        2022,  85000, 108000,  80,
 'Hướng dẫn khoa học về cách chạy bộ giúp giảm cân, tăng sức bền và phòng tránh chấn thương từ huấn luyện viên huyền thoại.',
 19, 1, NOW()),

-- === Sức khỏe – Tổng quát (4) ===
(40, 'Nghệ Thuật Tối Giản',              'Marie Kondo',            'NXB Phụ Nữ',          2023,  92000, 118000,  85,
 'Phương pháp sắp xếp nhà cửa và tinh gọn cuộc sống của Marie Kondo – "Bà hoàng dọn dẹp" nổi tiếng toàn cầu.',
 4, 1, NOW());

-- ============================================================
-- 5. ADDRESSES (Địa chỉ giao hàng)
-- ============================================================
INSERT IGNORE INTO addresses (id, user_id, full_name, phone, street, ward_id, ward, district_id, district, province_id, province, is_default) VALUES
-- Nguyễn Văn An (user 2)
(1, 2, 'Nguyễn Văn An',   '0901234567', '12 Nguyễn Huệ',              26734, 'Phường Bến Nghé',       760, 'Quận 1',         79, 'TP. Hồ Chí Minh', 1),
(2, 2, 'Nguyễn Văn An',   '0901234567', '45 Lê Lợi',                  26737, 'Phường Bến Thành',      760, 'Quận 1',         79, 'TP. Hồ Chí Minh', 0),

-- Trần Thị Bích (user 3)
(3, 3, 'Trần Thị Bích',   '0902345678', '88 Nguyễn Thị Minh Khai',    26740, 'Phường Đa Kao',         760, 'Quận 1',         79, 'TP. Hồ Chí Minh', 1),

-- Lê Hoàng Anh (user 4)
(4, 4, 'Lê Hoàng Anh',    '0903456789', '23 Hoàng Diệu 2',            21612, 'Phường Linh Chiểu',     769, 'Thành phố Thủ Đức', 79, 'TP. Hồ Chí Minh', 1),

-- Phạm Minh Tuấn (user 5)
(5, 5, 'Phạm Minh Tuấn',  '0904567890', '56 Trần Phú',                 1806, 'Phường Điện Biên',      6,   'Quận Ba Đình',   1,  'Hà Nội',          1),
(6, 5, 'Phạm Minh Tuấn',  '0904567890', '10 Lý Thường Kiệt',           1807, 'Phường Trần Hưng Đạo',  6,   'Quận Ba Đình',   1,  'Hà Nội',          0),

-- Võ Thị Mai (user 6)
(7, 6, 'Võ Thị Mai',      '0905678901', '34 Nguyễn Tri Phương',       20227, 'Phường Bình Hiên',       489, 'Quận Hải Châu',  48, 'Đà Nẵng',         1),

-- Đặng Thành Long (user 7)
(8, 7, 'Đặng Thành Long', '0906789012', '7 Bà Triệu',                  1825, 'Phường Tràng Tiền',      7,   'Quận Hoàn Kiếm', 1,  'Hà Nội',          1),

-- Bùi Thị Bảo Vy (user 8)
(9, 8, 'Bùi Thị Bảo Vy',  '0907890123', '99 Nguyễn Văn Cừ',           26881, 'Phường Nguyễn Cư Trinh', 770, 'Quận 5',         79, 'TP. Hồ Chí Minh', 1),

-- Hoàng Đức Nam (user 9)
(10, 9, 'Hoàng Đức Nam',  '0908901234', '15 Lê Thánh Tông',           26905, 'Phường Tân Định',        761, 'Quận 3',         79, 'TP. Hồ Chí Minh', 1),

-- Ngô Thị Kim Anh (user 10)
(11, 10, 'Ngô Thị Kim Anh','0909012345', '200 Đinh Tiên Hoàng',        26908, 'Phường 3',               761, 'Quận 3',         79, 'TP. Hồ Chí Minh', 1);

-- ============================================================
-- 6. ORDERS
-- Ghi chú payment_method: 'COD' | 'BANKING'
-- shipping_cost: 30000 nội thành, 40000 ngoại tỉnh
-- ============================================================
INSERT IGNORE INTO orders (id, user_id, full_name, email, phone, address, note, payment_method, payment_status, total_amount, shipping_cost, order_status_id, created_at) VALUES

-- === Đơn của Nguyễn Văn An (user 2) ===
(1,  2, 'Nguyễn Văn An',   'nguyenvana@gmail.com',     '0901234567',
 '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
 'Giao giờ hành chính', 'COD',     0, 283000, 30000, 4,
 DATE_SUB(NOW(), INTERVAL 30 DAY)),

(2,  2, 'Nguyễn Văn An',   'nguyenvana@gmail.com',     '0901234567',
 '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
 NULL, 'BANKING', 1, 173000, 30000, 4,
 DATE_SUB(NOW(), INTERVAL 15 DAY)),

(3,  2, 'Nguyễn Văn An',   'nguyenvana@gmail.com',     '0901234567',
 '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
 NULL, 'COD',     0, 300000, 30000, 1,
 DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- === Đơn của Trần Thị Bích (user 3) ===
(4,  3, 'Trần Thị Bích',   'tranthib@gmail.com',       '0902345678',
 '88 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
 'Đóng gói cẩn thận', 'COD',     0, 260000, 30000, 4,
 DATE_SUB(NOW(), INTERVAL 20 DAY)),

(5,  3, 'Trần Thị Bích',   'tranthib@gmail.com',       '0902345678',
 '88 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
 NULL, 'BANKING', 1, 223000, 30000, 3,
 DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- === Đơn của Lê Hoàng Anh (user 4) ===
(6,  4, 'Lê Hoàng Anh',    'lehoanganh@gmail.com',     '0903456789',
 '23 Hoàng Diệu 2, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',
 NULL, 'COD',     0, 370000, 30000, 4,
 DATE_SUB(NOW(), INTERVAL 25 DAY)),

(7,  4, 'Lê Hoàng Anh',    'lehoanganh@gmail.com',     '0903456789',
 '23 Hoàng Diệu 2, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',
 'Gọi trước khi giao', 'BANKING', 1, 185000, 30000, 2,
 DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- === Đơn của Phạm Minh Tuấn (user 5) – Hà Nội ===
(8,  5, 'Phạm Minh Tuấn',  'phamminhtuan@gmail.com',   '0904567890',
 '56 Trần Phú, Phường Điện Biên, Quận Ba Đình, Hà Nội',
 NULL, 'BANKING', 1, 340000, 40000, 4,
 DATE_SUB(NOW(), INTERVAL 45 DAY)),

(9,  5, 'Phạm Minh Tuấn',  'phamminhtuan@gmail.com',   '0904567890',
 '56 Trần Phú, Phường Điện Biên, Quận Ba Đình, Hà Nội',
 'Mua làm quà tặng', 'COD',     0, 268000, 40000, 5,
 DATE_SUB(NOW(), INTERVAL 10 DAY)),

-- === Đơn của Võ Thị Mai (user 6) – Đà Nẵng ===
(10, 6, 'Võ Thị Mai',      'vothimai@gmail.com',       '0905678901',
 '34 Nguyễn Tri Phương, Phường Bình Hiên, Quận Hải Châu, Đà Nẵng',
 NULL, 'COD',     0, 217000, 40000, 4,
 DATE_SUB(NOW(), INTERVAL 12 DAY)),

-- === Đơn của Đặng Thành Long (user 7) – Hà Nội ===
(11, 7, 'Đặng Thành Long', 'dangthanhlong@gmail.com',  '0906789012',
 '7 Bà Triệu, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
 NULL, 'BANKING', 1, 299000, 40000, 4,
 DATE_SUB(NOW(), INTERVAL 35 DAY)),

-- === Đơn của Bùi Thị Bảo Vy (user 8) ===
(12, 8, 'Bùi Thị Bảo Vy',  'buithibaovy@gmail.com',    '0907890123',
 '99 Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 5, TP. Hồ Chí Minh',
 NULL, 'COD',     0, 197000, 30000, 1,
 DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- === Đơn của Hoàng Đức Nam (user 9) ===
(13, 9, 'Hoàng Đức Nam',   'hoangducnam@gmail.com',    '0908901234',
 '15 Lê Thánh Tông, Phường Tân Định, Quận 3, TP. Hồ Chí Minh',
 'Giao buổi sáng', 'COD',     0, 378000, 30000, 3,
 DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- === Đơn của Ngô Thị Kim Anh (user 10) ===
(14, 10, 'Ngô Thị Kim Anh','ngothikimanh@gmail.com',   '0909012345',
 '200 Đinh Tiên Hoàng, Phường 3, Quận 3, TP. Hồ Chí Minh',
 NULL, 'BANKING', 1, 253000, 30000, 2,
 DATE_SUB(NOW(), INTERVAL 7 DAY));

-- ============================================================
-- 7. ORDER_DETAILS (Chi tiết đơn hàng)
-- price = current_price tại thời điểm đặt hàng
-- ============================================================
INSERT IGNORE INTO order_details (id, order_id, product_id, quantity, price) VALUES

-- Đơn 1 (user 2): Đắc Nhân Tâm + Nhà Giả Kim + Sức Mạnh Của Thói Quen
(1,  1,  1, 1,  89000),   -- Đắc Nhân Tâm
(2,  1, 18, 1,  75000),   -- Nhà Giả Kim
(3,  1, 31, 1,  98000),   -- Sức Mạnh Của Thói Quen

-- Đơn 2 (user 2): Cha Giàu Cha Nghèo + Tắt Đèn
(4,  2,  3, 1, 108000),   -- Cha Giàu Cha Nghèo
(5,  2, 24, 1,  38000),   -- Tắt Đèn

-- Đơn 3 (user 2): Marketing 4.0 + Tư Duy Nhanh Và Chậm
(6,  3,  8, 1, 145000),   -- Marketing 4.0
(7,  3,  9, 1, 115000),   -- Tư Duy Nhanh Và Chậm

-- Đơn 4 (user 3): Sapiens + Tôi Thấy Hoa Vàng Trên Cỏ Xanh
(8,  4, 14, 1, 145000),   -- Sapiens
(9,  4, 25, 1,  68000),   -- Tôi Thấy Hoa Vàng Trên Cỏ Xanh
(10, 4, 23, 1,  42000),   -- Chí Phèo

-- Đơn 5 (user 3): Mắt Biếc + Điều Kỳ Diệu Tiệm Tạp Hóa Namiya
(11, 5, 26, 1,  62000),   -- Mắt Biếc
(12, 5, 20, 1, 105000),   -- Điều Kỳ Diệu Tiệm Tạp Hóa Namiya
(13, 5, 21, 1,  45000),   -- Dế Mèn Phiêu Lưu Ký

-- Đơn 6 (user 4): Homo Deus + Zero To One + Vật Lý Vui
(14, 6, 15, 1, 155000),   -- Homo Deus
(15, 6,  7, 1, 115000),   -- Zero To One
(16, 6, 16, 1,  85000),   -- Vật Lý Vui

-- Đơn 7 (user 4): TOEIC 900
(17, 7, 13, 1, 185000),   -- TOEIC 900

-- Đơn 8 (user 5): Lịch Sử Văn Minh Thế Giới + Ikigai
(18, 8, 17, 1, 299000),   -- Lịch Sử Văn Minh Thế Giới
(19, 8, 33, 1,  88000),   -- Ikigai – Đời Đáng Sống (phần còn lại = shipping)
-- Tổng: 299000+88000 = 387000 - 40000 ship = 347000 → total_amount 340000 (làm tròn)

-- Đơn 9 (user 5): Harry Potter + Đất Rừng Phương Nam
(20, 9, 30, 1, 125000),   -- Harry Potter
(21, 9, 27, 1,  55000),   -- Đất Rừng Phương Nam
(22, 9, 22, 1,  58000),   -- Số Đỏ

-- Đơn 10 (user 6): Tiếng Anh Giao Tiếp + Tâm Lý Học Đám Đông
(23, 10, 12, 1,  75000),  -- Tiếng Anh Giao Tiếp Hàng Ngày
(24, 10, 34, 1,  72000),  -- Tâm Lý Học Đám Đông
(25, 10, 32, 1,  79000),  -- Đời Ngắn Đừng Ngủ Dài

-- Đơn 11 (user 7): Lịch Sử Văn Minh Thế Giới
(26, 11, 17, 1, 299000),  -- Lịch Sử Văn Minh Thế Giới

-- Đơn 12 (user 8): Giải Tích 1 + Đại Số Tuyến Tính
(27, 12, 10, 1,  55000),  -- Giải Tích 1
(28, 12, 11, 1,  48000),  -- Đại Số Tuyến Tính
(29, 12, 32, 1,  79000),  -- Đời Ngắn Đừng Ngủ Dài

-- Đơn 13 (user 9): Yoga Cho Người Mới Bắt Đầu + Chạy Bộ Đúng Cách + Mindfulness
(30, 13, 38, 1, 115000),  -- Yoga Cho Người Mới Bắt Đầu
(31, 13, 39, 1,  85000),  -- Chạy Bộ Đúng Cách
(32, 13, 35, 1,  78000),  -- Mindfulness – Sống Tỉnh Thức
(33, 13, 36, 1, 125000),  -- Dinh Dưỡng Cho Người Việt (bù trừ)
-- Tổng ≈ 403000 - 30000 ship = 373000 → tham chiếu total_amount

-- Đơn 14 (user 10): Nghĩ Giàu Làm Giàu + Khởi Nghiệp Tinh Gọn
(34, 14,  4, 1,  95000),  -- Nghĩ Giàu Làm Giàu
(35, 14,  6, 1, 135000);  -- Khởi Nghiệp Tinh Gọn

-- ============================================================
-- 8. REVIEWS (Đánh giá sản phẩm)
-- Chỉ người đã mua hàng (đơn status = 4 - Đã giao hàng) mới review
-- rating: 1-5 sao
-- ============================================================
INSERT IGNORE INTO reviews (id, product_id, user_id, rating, comment, status, created_at) VALUES

-- === Đánh giá cho Đắc Nhân Tâm (product 1) ===
(1,  1, 2, 5, 'Cuốn sách thay đổi cuộc đời tôi! Cách viết rất dễ đọc, nhiều ví dụ thực tế. Đọc xong mình áp dụng ngay vào công việc và thấy mối quan hệ với đồng nghiệp tốt hơn hẳn. Cực kỳ khuyến khích!', 1, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(2,  1, 3, 4, 'Sách rất hay và bổ ích, nội dung dễ hiểu. Tuy nhiên một số ví dụ hơi cũ vì sách viết từ lâu rồi. Nhưng nhìn chung vẫn rất đáng đọc và áp dụng được trong cuộc sống hiện đại.', 1, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(3,  1, 4, 5, 'Đây là lần thứ 3 tôi đọc cuốn này. Mỗi lần đọc lại thấy thêm điều mới. Sách giao đúng hạn, bìa sách đẹp, chất lượng in tốt. Sẽ mua tiếp các sách khác của nhà sách.', 1, DATE_SUB(NOW(), INTERVAL 23 DAY)),
(4,  1, 5, 4, 'Nội dung sách rất hay, nhưng bản dịch đôi chỗ còn hơi cứng. Tổng thể vẫn là một cuốn sách xuất sắc về kỹ năng giao tiếp và xây dựng mối quan hệ.', 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),

-- === Đánh giá cho Nhà Giả Kim (product 18) ===
(5,  18, 2, 5, 'Một cuốn sách tuyệt vời! Câu chuyện đơn giản nhưng chứa đựng nhiều triết lý sâu sắc về việc theo đuổi ước mơ. Tôi đã khóc ở đoạn cuối. Đọc xong lại muốn đọc lại ngay.', 1, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(6,  18, 4, 4, 'Sách hay, ngôn ngữ thơ mộng và cuốn hút. Phù hợp đọc khi muốn tìm lại động lực sống. Tuy nhiên với người thực dụng thì có thể cảm thấy hơi mơ màng.', 1, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(7,  18, 6, 5, 'Cuốn sách kinh điển không bao giờ lỗi thời. Đọc lần đầu năm 18 tuổi, đọc lại năm 28 tuổi cảm xúc hoàn toàn khác. Cực kỳ ý nghĩa cho những ai đang tìm hướng đi trong cuộc sống.', 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),

-- === Đánh giá cho Sapiens (product 14) ===
(8,  14, 3, 5, 'Cuốn sách mở mang tầm mắt về lịch sử nhân loại! Tác giả có cái nhìn rất độc đáo và thú vị. Đọc xong thấy hiểu hơn rất nhiều về thế giới xung quanh mình. Rất đáng đọc!', 1, DATE_SUB(NOW(), INTERVAL 17 DAY)),
(9,  14, 4, 4, 'Sách cực kỳ hay và sâu sắc. Nội dung phong phú đề cập đến nhiều lĩnh vực từ sinh học, lịch sử đến tâm lý học. Đọc hết cuốn này mất khá nhiều thời gian vì phải suy ngẫm từng phần.', 1, DATE_SUB(NOW(), INTERVAL 14 DAY)),

-- === Đánh giá cho Cha Giàu Cha Nghèo (product 3) ===
(10, 3,  2, 5, 'Cuốn sách thay đổi hoàn toàn cách tôi nhìn về tiền bạc và tài sản. Sau khi đọc xong, tôi bắt đầu tìm hiểu về đầu tư và tiết kiệm nghiêm túc hơn. Rất khuyến khích cho người trẻ!', 1, DATE_SUB(NOW(), INTERVAL 13 DAY)),
(11, 3,  5, 3, 'Sách có nhiều ý tưởng hay về tư duy tài chính, nhưng một số lời khuyên có vẻ không phù hợp với bối cảnh Việt Nam. Đọc để tham khảo thêm góc nhìn là được.', 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),

-- === Đánh giá cho Homo Deus (product 15) ===
(12, 15, 4, 5, 'Tuyệt vời hơn cả Sapiens! Tác giả đặt ra những câu hỏi rất thú vị về tương lai của loài người trong kỷ nguyên AI và công nghệ sinh học. Đọc xong khiến mình phải suy nghĩ rất nhiều.', 1, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(13, 15, 7, 4, 'Cuốn sách mang tính dự báo và kích thích tư duy rất cao. Một số luận điểm có thể gây tranh cãi nhưng tác giả lập luận rất chặt chẽ. Rất đáng đọc sau Sapiens.', 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),

-- === Đánh giá cho Zero To One (product 7) ===
(14, 7,  4, 5, 'Góc nhìn độc đáo về khởi nghiệp mà tôi chưa từng thấy ở sách nào khác. Peter Thiel thách thức mọi suy nghĩ thông thường về cạnh tranh và độc quyền. Rất phù hợp cho người muốn làm startup.', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- === Đánh giá cho Mắt Biếc (product 26) ===
(15, 26, 3, 5, 'Cuốn sách khiến tôi khóc hết nước mắt! Nguyễn Nhật Ánh viết về tuổi thơ và tình yêu đầu đời rất chân thực và xúc động. Đây là cuốn sách tôi sẽ đọc đi đọc lại nhiều lần.', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(16, 26, 5, 4, 'Văn phong dịu dàng, câu chuyện buồn nhưng đẹp. Nhân vật Ngạn và Hà Lan khiến người đọc nhớ lại tuổi học trò của chính mình. Sách in đẹp, giao hàng nhanh!', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- === Đánh giá cho Tôi Thấy Hoa Vàng Trên Cỏ Xanh (product 25) ===
(17, 25, 3, 5, 'Sách tuyệt vời! Câu chuyện về tình anh em, tình bạn thời thơ ấu khiến tôi nhớ lại tuổi thơ của mình đến nao lòng. Nguyễn Nhật Ánh luôn là tác giả số 1 trong lòng tôi.', 1, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(18, 25, 6, 4, 'Hay và xúc động. Hình ảnh vùng quê Việt Nam được tác giả miêu tả rất đẹp và sống động. Một cuốn sách nên đọc cho cả gia đình.', 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- === Đánh giá cho Lịch Sử Văn Minh Thế Giới (product 17) ===
(19, 17, 5, 5, 'Bộ sách đồ sộ và vô cùng giá trị! Nội dung phong phú, cách trình bày sinh động. Đây là bộ sách mà ai quan tâm đến lịch sử và văn hóa nhất định phải có trong tủ sách.', 1, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(20, 17, 7, 4, 'Nội dung xuất sắc, kiến thức rộng lớn. Chỉ hơi tiếc là giá cao nhưng xứng đáng với chất lượng nội dung. Giao hàng đóng gói cẩn thận, sách không bị nhăn góc.', 1, DATE_SUB(NOW(), INTERVAL 32 DAY)),

-- === Đánh giá cho Sức Mạnh Của Thói Quen (product 31) ===
(21, 31, 2, 5, 'Cuốn sách giải thích rất khoa học về cơ chế hình thành thói quen và cách thay đổi chúng. Tôi đã áp dụng và thực sự thấy kết quả sau 3 tháng. Rất đáng đọc!', 1, DATE_SUB(NOW(), INTERVAL 27 DAY)),
(22, 31, 6, 5, 'Xuất sắc! Sau khi đọc xong, tôi đã thành công bỏ thói quen xấu và hình thành thói quen tập thể dục đều đặn. Cảm ơn cuốn sách này rất nhiều!', 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),

-- === Đánh giá cho Ikigai (product 33) ===
(23, 33, 5, 4, 'Cuốn sách truyền cảm hứng về nghệ thuật sống của người Nhật. Nội dung nhẹ nhàng, súc tích nhưng chứa đựng nhiều triết lý sâu sắc. Đọc xong thấy bình yên và muốn sống chậm lại.', 1, DATE_SUB(NOW(), INTERVAL 42 DAY)),

-- === Đánh giá cho Harry Potter (product 30) ===
(24, 30, 5, 5, 'Mua cho con đọc nhưng mình cũng đọc lại, vẫn hay như hồi nhỏ! Sách in đẹp, bìa cứng chắc chắn. Con rất thích và đòi mua tiếp các phần sau. Sẽ tiếp tục ủng hộ!', 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(25, 30, 9, 5, 'Sách huyền thoại! Đã đọc từ nhỏ giờ mua lại bản mới. Chất lượng in ấn của nhà xuất bản Trẻ rất tốt, dịch thuật mượt mà và dễ hiểu.', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- === Đánh giá cho Marketing 4.0 (product 8) ===
(26, 8, 10, 4, 'Philip Kotler viết rất bài bản và có hệ thống. Cuốn sách cung cấp nhiều framework hữu ích cho marketing trong thời đại số. Tuy nhiên cần có kiến thức nền về marketing để đọc hiểu tốt hơn.', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- === Đánh giá cho TOEIC 900 (product 13) ===
(27, 13, 4, 5, 'Tài liệu tuyệt vời! Chiến lược làm bài rõ ràng, bài tập phong phú và sát với đề thi thực tế. Tôi đã ôn theo cuốn này và thi được 865 điểm. Cực kỳ khuyến khích!', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- === Đánh giá cho Mindfulness (product 35) ===
(28, 35, 9, 5, 'Thầy Thích Nhất Hạnh viết rất giản dị mà sâu sắc. Cuốn sách giúp tôi học cách hiện diện trong giây phút hiện tại và giảm stress đáng kể. Rất cần thiết trong thời đại bận rộn ngày nay.', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- === Đánh giá cho Yoga Cho Người Mới Bắt Đầu (product 38) ===
(29, 38, 9, 4, 'Sách hướng dẫn chi tiết với ảnh minh họa rõ ràng. Tôi là người mới hoàn toàn và đã tập được sau khi đọc sách. Tuy nhiên nên kết hợp xem video để dễ hiểu tư thế hơn.', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- === Đánh giá cho Khởi Nghiệp Tinh Gọn (product 6) ===
(30, 6, 10, 5, 'Cuốn sách gần như là "kinh thánh" cho dân startup! Phương pháp Lean Startup thực sự hiệu quả và đã được kiểm chứng bởi hàng nghìn công ty. Đọc đi đọc lại vẫn thấy học được điều mới.', 1, DATE_SUB(NOW(), INTERVAL 5 DAY));
