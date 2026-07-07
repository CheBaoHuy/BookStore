package com.bookstore.config;

import com.bookstore.model.*;
import com.bookstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            OrderStatusRepository orderStatusRepository,
            OrderRepository orderRepository,
            OrderDetailRepository orderDetailRepository,
            ReviewRepository reviewRepository,
            AddressRepository addressRepository
    ) {
        return args -> {

            // Ảnh sản phẩm sẽ được tự động cập nhật ở cuối quá trình khởi tạo dữ liệu.

            // =============================================
            // 1. ORDER STATUSES
            // =============================================
            if (orderStatusRepository.count() == 0) {
                orderStatusRepository.save(OrderStatus.builder().status("Chờ xác nhận").build());
                orderStatusRepository.save(OrderStatus.builder().status("Đã xác nhận").build());
                orderStatusRepository.save(OrderStatus.builder().status("Đang giao hàng").build());
                orderStatusRepository.save(OrderStatus.builder().status("Đã giao hàng").build());
                orderStatusRepository.save(OrderStatus.builder().status("Đã hủy").build());
                System.out.println("✅ Khởi tạo trạng thái đơn hàng.");
            }

            // =============================================
            // 2. USERS
            // =============================================
            if (userRepository.count() == 0) {
                userRepository.save(User.builder()
                        .username("admin").password(passwordEncoder.encode("admin123"))
                        .email("admin@bookstore.com").fullName("Quản Trị Viên")
                        .phone("0900000001").role("ADMIN").status(true).build());

                userRepository.save(User.builder()
                        .username("nguyenvana").password(passwordEncoder.encode("123456"))
                        .email("nguyenvana@gmail.com").fullName("Nguyễn Văn An")
                        .phone("0901234567").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=11").build());

                userRepository.save(User.builder()
                        .username("tranthib").password(passwordEncoder.encode("123456"))
                        .email("tranthib@gmail.com").fullName("Trần Thị Bích")
                        .phone("0902345678").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=5").build());

                userRepository.save(User.builder()
                        .username("lehoanganh").password(passwordEncoder.encode("123456"))
                        .email("lehoanganh@gmail.com").fullName("Lê Hoàng Anh")
                        .phone("0903456789").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=12").build());

                userRepository.save(User.builder()
                        .username("phamminhtuan").password(passwordEncoder.encode("123456"))
                        .email("phamminhtuan@gmail.com").fullName("Phạm Minh Tuấn")
                        .phone("0904567890").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=13").build());

                userRepository.save(User.builder()
                        .username("vothimai").password(passwordEncoder.encode("123456"))
                        .email("vothimai@gmail.com").fullName("Võ Thị Mai")
                        .phone("0905678901").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=9").build());

                userRepository.save(User.builder()
                        .username("dangthanhlong").password(passwordEncoder.encode("123456"))
                        .email("dangthanhlong@gmail.com").fullName("Đặng Thành Long")
                        .phone("0906789012").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=14").build());

                userRepository.save(User.builder()
                        .username("buithibaovy").password(passwordEncoder.encode("123456"))
                        .email("buithibaovy@gmail.com").fullName("Bùi Thị Bảo Vy")
                        .phone("0907890123").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=47").build());

                userRepository.save(User.builder()
                        .username("hoangducnam").password(passwordEncoder.encode("123456"))
                        .email("hoangducnam@gmail.com").fullName("Hoàng Đức Nam")
                        .phone("0908901234").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=15").build());

                userRepository.save(User.builder()
                        .username("ngothikimanh").password(passwordEncoder.encode("123456"))
                        .email("ngothikimanh@gmail.com").fullName("Ngô Thị Kim Anh")
                        .phone("0909012345").role("USER").status(true)
                        .avatar("https://i.pravatar.cc/150?img=44").build());

                System.out.println("✅ Khởi tạo 10 tài khoản người dùng.");
            }

            // =============================================
            // 3. CATEGORIES
            // =============================================
            if (categoryRepository.count() == 0) {

                // Danh mục cha
                Category hocTap    = categoryRepository.save(Category.builder().name("Học tập").active(true).build());
                Category tieuThuyet= categoryRepository.save(Category.builder().name("Tiểu thuyết").active(true).build());
                Category kinhDoanh = categoryRepository.save(Category.builder().name("Kinh doanh").active(true).build());
                Category sucKhoe   = categoryRepository.save(Category.builder().name("Sức khỏe").active(true).build());

                // Danh mục con — Học tập
                Category khoaHoc   = categoryRepository.save(Category.builder().name("Khoa học").active(true).parentCategory(hocTap).build());
                Category lichSu    = categoryRepository.save(Category.builder().name("Lịch sử").active(true).parentCategory(hocTap).build());
                Category ngoaiNgu  = categoryRepository.save(Category.builder().name("Ngoại ngữ").active(true).parentCategory(hocTap).build());
                Category giaoTrinh = categoryRepository.save(Category.builder().name("Giáo trình ĐH").active(true).parentCategory(hocTap).build());

                // Danh mục con — Tiểu thuyết
                Category vanHocVN  = categoryRepository.save(Category.builder().name("Văn học Việt Nam").active(true).parentCategory(tieuThuyet).build());
                Category vanHocNN  = categoryRepository.save(Category.builder().name("Văn học nước ngoài").active(true).parentCategory(tieuThuyet).build());
                Category trinhTham = categoryRepository.save(Category.builder().name("Trinh thám").active(true).parentCategory(tieuThuyet).build());
                Category vienTuong = categoryRepository.save(Category.builder().name("Viễn tưởng").active(true).parentCategory(tieuThuyet).build());

                // Danh mục con — Kinh doanh
                Category taiChinh  = categoryRepository.save(Category.builder().name("Tài chính").active(true).parentCategory(kinhDoanh).build());
                Category quanLy    = categoryRepository.save(Category.builder().name("Quản lý").active(true).parentCategory(kinhDoanh).build());
                Category marketing = categoryRepository.save(Category.builder().name("Marketing").active(true).parentCategory(kinhDoanh).build());
                Category khoidNghiep= categoryRepository.save(Category.builder().name("Khởi nghiệp").active(true).parentCategory(kinhDoanh).build());

                // Danh mục con — Sức khỏe
                Category tamLy     = categoryRepository.save(Category.builder().name("Tâm lý").active(true).parentCategory(sucKhoe).build());
                Category dieuDuong = categoryRepository.save(Category.builder().name("Dinh dưỡng").active(true).parentCategory(sucKhoe).build());
                Category theDuc    = categoryRepository.save(Category.builder().name("Thể dục thể thao").active(true).parentCategory(sucKhoe).build());

                System.out.println("✅ Khởi tạo 19 danh mục sách.");

                // =============================================
                // 4. PRODUCTS (50+ sản phẩm)
                // =============================================
                if (productRepository.count() == 0) {

                    // ---- KINH DOANH ----
                    productRepository.save(Product.builder()
                        .title("Đắc Nhân Tâm").author("Dale Carnegie")
                        .publisher("NXB Tổng hợp TP.HCM").publishYear(2023)
                        .currentPrice(new BigDecimal("89000")).oldPrice(new BigDecimal("120000"))
                        .quantity(150).category(kinhDoanh).active(true)
                        .description("Cuốn sách kinh điển về nghệ thuật đối nhân xử thế và giao tiếp. Đây là một trong những cuốn sách bán chạy nhất mọi thời đại với hơn 30 triệu bản được bán ra trên toàn thế giới.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Người Giàu Có Nhất Thành Babylon").author("George S. Clason")
                        .publisher("NXB Thanh Niên").publishYear(2022)
                        .currentPrice(new BigDecimal("65000")).oldPrice(new BigDecimal("85000"))
                        .quantity(90).category(taiChinh).active(true)
                        .description("Những bài học về tài chính cá nhân từ thành Babylon cổ đại. Cuốn sách cung cấp những nguyên tắc bất hủ về tiết kiệm, đầu tư và xây dựng sự giàu có.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/8c/cc/a3/8f7d32e3d6b0a0c0a1c7e3a2d9e5f1b2.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Cha Giàu Cha Nghèo").author("Robert T. Kiyosaki")
                        .publisher("NXB Trẻ").publishYear(2023)
                        .currentPrice(new BigDecimal("108000")).oldPrice(new BigDecimal("140000"))
                        .quantity(120).category(taiChinh).active(true)
                        .description("Cuốn sách thay đổi tư duy về tiền bạc và đầu tư. Robert Kiyosaki chia sẻ những bài học tài chính mà cha giàu đã dạy ông và sự khác biệt hoàn toàn với những gì cha nghèo ông dạy.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/e4/d0/c1/d3c6a3b6e1e7f0c9a8b7c6d5e4f3a2b1.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Nghĩ Giàu Làm Giàu").author("Napoleon Hill")
                        .publisher("NXB Lao Động").publishYear(2022)
                        .currentPrice(new BigDecimal("95000")).oldPrice(new BigDecimal("125000"))
                        .quantity(80).category(taiChinh).active(true)
                        .description("Bí quyết thành công từ 500 người giàu nhất nước Mỹ. Napoleon Hill đã nghiên cứu trong 20 năm để đúc kết 13 nguyên tắc dẫn đến thành công.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/a1/b2/c3/d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Tư Duy Phản Biện").author("Richard Paul & Linda Elder")
                        .publisher("NXB Thế Giới").publishYear(2023)
                        .currentPrice(new BigDecimal("119000")).oldPrice(new BigDecimal("155000"))
                        .quantity(60).category(quanLy).active(true)
                        .description("Hướng dẫn toàn diện để cải thiện tư duy phân tích và phản biện trong công việc và cuộc sống.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/b1/c2/d3/e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Khởi Nghiệp Tinh Gọn").author("Eric Ries")
                        .publisher("NXB Trẻ").publishYear(2022)
                        .currentPrice(new BigDecimal("135000")).oldPrice(new BigDecimal("165000"))
                        .quantity(70).category(khoidNghiep).active(true)
                        .description("Phương pháp đột phá để tạo ra các công ty khởi nghiệp thành công. The Lean Startup đã thay đổi cách các doanh nghiệp được xây dựng trên toàn thế giới.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/c2/d3/e4/f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Marketing 4.0").author("Philip Kotler")
                        .publisher("NXB Trẻ").publishYear(2023)
                        .currentPrice(new BigDecimal("145000")).oldPrice(new BigDecimal("180000"))
                        .quantity(55).category(marketing).active(true)
                        .description("Chuyển đổi từ truyền thống sang kỹ thuật số. Philip Kotler hướng dẫn cách thương hiệu nên điều hướng trong môi trường kỹ thuật số.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/d3/e4/f5/a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Zero To One").author("Peter Thiel")
                        .publisher("NXB Thế Giới").publishYear(2022)
                        .currentPrice(new BigDecimal("115000")).oldPrice(new BigDecimal("149000"))
                        .quantity(65).category(khoidNghiep).active(true)
                        .description("Ghi chú về các công ty khởi nghiệp, hoặc cách xây dựng tương lai. Peter Thiel chia sẻ bí quyết xây dựng những công ty tạo ra giá trị độc đáo.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/e4/f5/a6/b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2.jpg")
                        .build());

                    // ---- HỌC TẬP ----
                    productRepository.save(Product.builder()
                        .title("Tư Duy Nhanh Và Chậm").author("Daniel Kahneman")
                        .publisher("NXB Thế Giới").publishYear(2023)
                        .currentPrice(new BigDecimal("115000")).oldPrice(new BigDecimal("150000"))
                        .quantity(50).category(hocTap).active(true)
                        .description("Khám phá cách tâm trí con người hoạt động qua hai hệ thống tư duy: nhanh và chậm. Daniel Kahneman, người đoạt giải Nobel, giải thích những quyết định mà chúng ta đưa ra.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/f5/a6/b7/c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Giải Tích 1").author("Nguyễn Đình Trí")
                        .publisher("NXB Giáo Dục").publishYear(2023)
                        .currentPrice(new BigDecimal("55000")).oldPrice(null)
                        .quantity(200).category(giaoTrinh).active(true)
                        .description("Giáo trình giải tích toán học cho sinh viên đại học năm nhất. Bao gồm các khái niệm về giới hạn, đạo hàm, tích phân và chuỗi số.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/a6/b7/c8/d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Đại Số Tuyến Tính").author("Nguyễn Thủy Thanh")
                        .publisher("NXB Giáo Dục").publishYear(2022)
                        .currentPrice(new BigDecimal("48000")).oldPrice(null)
                        .quantity(180).category(giaoTrinh).active(true)
                        .description("Giáo trình đại số tuyến tính cho sinh viên kỹ thuật và tự nhiên. Trình bày hệ thống các kiến thức về ma trận, định thức, không gian vectơ.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/b7/c8/d9/e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Tiếng Anh Giao Tiếp Hàng Ngày").author("Thu Hương")
                        .publisher("NXB Trẻ").publishYear(2023)
                        .currentPrice(new BigDecimal("75000")).oldPrice(new BigDecimal("95000"))
                        .quantity(300).category(ngoaiNgu).active(true)
                        .description("Cẩm nang tiếng Anh giao tiếp cho người Việt. Hơn 3000 câu thoại thông dụng trong các tình huống đời thường như mua sắm, du lịch, công việc.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/c8/d9/e0/f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("TOEIC 900 - Chiến Lược Vàng").author("Su Yeon Kim")
                        .publisher("NXB Tổng hợp TP.HCM").publishYear(2023)
                        .currentPrice(new BigDecimal("185000")).oldPrice(new BigDecimal("220000"))
                        .quantity(100).category(ngoaiNgu).active(true)
                        .description("Tài liệu luyện thi TOEIC từ 700 đến 900+ điểm. Bao gồm chiến lược làm bài, 1000 câu hỏi mẫu và 3 đề thi thử đầy đủ.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/d9/e0/f1/a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Sapiens: Lược Sử Loài Người").author("Yuval Noah Harari")
                        .publisher("NXB Tri Thức").publishYear(2022)
                        .currentPrice(new BigDecimal("145000")).oldPrice(new BigDecimal("180000"))
                        .quantity(60).category(khoaHoc).active(true)
                        .description("Hành trình 70.000 năm lịch sử nhân loại từ khi con người xuất hiện đến thế giới hiện đại. Yuval Noah Harari phân tích cách văn hóa, kinh tế và chính trị định hình thế giới ngày nay.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/e0/f1/a2/b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Homo Deus: Lược Sử Tương Lai").author("Yuval Noah Harari")
                        .publisher("NXB Tri Thức").publishYear(2023)
                        .currentPrice(new BigDecimal("155000")).oldPrice(new BigDecimal("190000"))
                        .quantity(45).category(khoaHoc).active(true)
                        .description("Câu chuyện về ngày mai của loài người. Sau Sapiens, Harari tiếp tục khám phá những dự án lớn của nhân loại trong thế kỷ 21.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/f1/a2/b3/c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Lịch Sử Văn Minh Thế Giới").author("Will Durant")
                        .publisher("NXB Hồng Đức").publishYear(2021)
                        .currentPrice(new BigDecimal("299000")).oldPrice(new BigDecimal("380000"))
                        .quantity(30).category(lichSu).active(true)
                        .description("Bộ sách đồ sộ về lịch sử văn minh của nhân loại từ thời cổ đại đến hiện đại. Will Durant dành cả cuộc đời để viết nên kiệt tác này.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/a2/b3/c4/d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Vật Lý Vui").author("Yakov Perelman")
                        .publisher("NXB Giáo Dục").publishYear(2022)
                        .currentPrice(new BigDecimal("85000")).oldPrice(new BigDecimal("110000"))
                        .quantity(120).category(khoaHoc).active(true)
                        .description("Khám phá thế giới vật lý qua những câu chuyện thú vị và hấp dẫn. Yakov Perelman biến những khái niệm khó hiểu thành những câu chuyện dễ tiếp cận.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/b3/c4/d5/e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1.jpg")
                        .build());

                    // ---- TIỂU THUYẾT ----
                    productRepository.save(Product.builder()
                        .title("Nhà Giả Kim").author("Paulo Coelho")
                        .publisher("NXB Hội Nhà Văn").publishYear(2022)
                        .currentPrice(new BigDecimal("75000")).oldPrice(new BigDecimal("90000"))
                        .quantity(80).category(vanHocNN).active(true)
                        .description("Tiểu thuyết kinh điển về hành trình theo đuổi ước mơ của chàng chăn cừu Santiago. Một trong những cuốn sách bán chạy nhất thế giới với hơn 65 triệu bản.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/c4/d5/e6/f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Dế Mèn Phiêu Lưu Ký").author("Tô Hoài")
                        .publisher("NXB Kim Đồng").publishYear(2021)
                        .currentPrice(new BigDecimal("45000")).oldPrice(null)
                        .quantity(250).category(vanHocVN).active(true)
                        .description("Tác phẩm kinh điển của văn học thiếu nhi Việt Nam. Câu chuyện về cuộc phiêu lưu của chú Dế Mèn và những người bạn đã gắn liền với tuổi thơ của bao thế hệ người Việt.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/d5/e6/f7/a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Số Đỏ").author("Vũ Trọng Phụng")
                        .publisher("NXB Văn Học").publishYear(2022)
                        .currentPrice(new BigDecimal("58000")).oldPrice(new BigDecimal("72000"))
                        .quantity(100).category(vanHocVN).active(true)
                        .description("Tiểu thuyết trào phúng kinh điển của Vũ Trọng Phụng, phơi bày sự thối nát của xã hội Việt Nam thời Pháp thuộc qua nhân vật Xuân Tóc Đỏ.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/e6/f7/a8/b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Chí Phèo - Nam Cao").author("Nam Cao")
                        .publisher("NXB Văn Học").publishYear(2021)
                        .currentPrice(new BigDecimal("42000")).oldPrice(null)
                        .quantity(150).category(vanHocVN).active(true)
                        .description("Tập truyện ngắn kinh điển của nhà văn Nam Cao. Bao gồm Chí Phèo, Lão Hạc và nhiều truyện ngắn đặc sắc khác phản ánh cuộc sống người nông dân Việt Nam trước 1945.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/f7/a8/b9/c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Tắt Đèn").author("Ngô Tất Tố")
                        .publisher("NXB Văn Học").publishYear(2021)
                        .currentPrice(new BigDecimal("38000")).oldPrice(null)
                        .quantity(120).category(vanHocVN).active(true)
                        .description("Tiểu thuyết kinh điển về cuộc sống khổ cực của người nông dân dưới ách áp bức của chế độ thực dân phong kiến, tiêu biểu qua nhân vật chị Dậu.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/a8/b9/c0/d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Harry Potter Và Hòn Đá Phù Thủy").author("J.K. Rowling")
                        .publisher("NXB Trẻ").publishYear(2022)
                        .currentPrice(new BigDecimal("125000")).oldPrice(new BigDecimal("155000"))
                        .quantity(200).category(vienTuong).active(true)
                        .description("Phần đầu tiên trong series Harry Potter huyền thoại. Câu chuyện về cậu bé phù thủy Harry Potter và những cuộc phiêu lưu kỳ bí tại trường Hogwarts.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/b9/c0/d1/e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Muôn Kiếp Nhân Sinh").author("Brian Weiss")
                        .publisher("NXB Tổng hợp TP.HCM").publishYear(2023)
                        .currentPrice(new BigDecimal("89000")).oldPrice(new BigDecimal("115000"))
                        .quantity(180).category(vanHocNN).active(true)
                        .description("Cuốn sách về liệu pháp hồi quy kiếp trước của bác sĩ tâm thần Brian Weiss đã gây chấn động thế giới và trở thành hiện tượng bán sách toàn cầu.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/c0/d1/e2/f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Bố Già").author("Mario Puzo")
                        .publisher("NXB Văn Học").publishYear(2022)
                        .currentPrice(new BigDecimal("115000")).oldPrice(new BigDecimal("145000"))
                        .quantity(70).category(trinhTham).active(true)
                        .description("Tiểu thuyết kinh điển về thế giới ngầm Mafia của Mario Puzo. Câu chuyện về gia đình Corleone đã trở thành một trong những tác phẩm văn học được yêu thích nhất mọi thời đại.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/d1/e2/f3/a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Và Rồi Không Còn Ai").author("Agatha Christie")
                        .publisher("NXB Hội Nhà Văn").publishYear(2022)
                        .currentPrice(new BigDecimal("79000")).oldPrice(new BigDecimal("98000"))
                        .quantity(85).category(trinhTham).active(true)
                        .description("Tiểu thuyết trinh thám xuất sắc nhất của Agatha Christie - Nữ hoàng truyện trinh thám. Mười người bị mắc kẹt trên một hòn đảo và lần lượt chết theo những câu đố bí ẩn.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/e2/f3/a4/b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya").author("Keigo Higashino")
                        .publisher("NXB Trẻ").publishYear(2023)
                        .currentPrice(new BigDecimal("105000")).oldPrice(new BigDecimal("135000"))
                        .quantity(130).category(vanHocNN).active(true)
                        .description("Câu chuyện cảm động về một tiệm tạp hóa có khả năng kỳ diệu - trả lời những bức thư từ quá khứ. Tác phẩm của Keigo Higashino chứa đựng những thông điệp sâu sắc về cuộc sống.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/f3/a4/b5/c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Tôi Thấy Hoa Vàng Trên Cỏ Xanh").author("Nguyễn Nhật Ánh")
                        .publisher("NXB Trẻ").publishYear(2022)
                        .currentPrice(new BigDecimal("68000")).oldPrice(new BigDecimal("85000"))
                        .quantity(200).category(vanHocVN).active(true)
                        .description("Câu chuyện tuổi thơ đẹp đẽ và cảm động về tình anh em, tình bạn ở một vùng quê nghèo miền Trung. Nguyễn Nhật Ánh đã tạo nên một tác phẩm đầy tính nhân văn.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/a4/b5/c6/d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Mắt Biếc").author("Nguyễn Nhật Ánh")
                        .publisher("NXB Trẻ").publishYear(2023)
                        .currentPrice(new BigDecimal("62000")).oldPrice(new BigDecimal("78000"))
                        .quantity(170).category(vanHocVN).active(true)
                        .description("Chuyện tình buồn của Ngạn và Hà Lan qua những năm tháng tuổi thơ và trưởng thành. Một trong những tác phẩm được yêu thích nhất của nhà văn Nguyễn Nhật Ánh.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/b5/c6/d7/e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Đất Rừng Phương Nam").author("Đoàn Giỏi")
                        .publisher("NXB Kim Đồng").publishYear(2021)
                        .currentPrice(new BigDecimal("55000")).oldPrice(new BigDecimal("70000"))
                        .quantity(140).category(vanHocVN).active(true)
                        .description("Tiểu thuyết kinh điển về thiên nhiên và con người Nam Bộ. Câu chuyện về cậu bé An và những cuộc phiêu lưu kỳ thú giữa rừng đước, sông nước miền Tây.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/c6/d7/e8/f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4.jpg")
                        .build());

                    // ---- SỨC KHỎE ----
                    productRepository.save(Product.builder()
                        .title("Sức Mạnh Của Thói Quen").author("Charles Duhigg")
                        .publisher("NXB Lao Động").publishYear(2023)
                        .currentPrice(new BigDecimal("98000")).oldPrice(new BigDecimal("130000"))
                        .quantity(90).category(tamLy).active(true)
                        .description("Khám phá bí quyết thay đổi thói quen trong cuộc sống và công việc. Charles Duhigg giải thích khoa học đằng sau việc hình thành và thay đổi thói quen.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/d7/e8/f9/a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Đời Ngắn Đừng Ngủ Dài").author("Robin Sharma")
                        .publisher("NXB Trẻ").publishYear(2023)
                        .currentPrice(new BigDecimal("79000")).oldPrice(new BigDecimal("99000"))
                        .quantity(110).category(tamLy).active(true)
                        .description("Bí quyết thức dậy lúc 5 giờ sáng và thay đổi cuộc đời. Robin Sharma chia sẻ những thói quen của người thành công nhất thế giới.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/e8/f9/a0/b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Ikigai - Đời Đáng Sống").author("Héctor García & Francesc Miralles")
                        .publisher("NXB Thế Giới").publishYear(2022)
                        .currentPrice(new BigDecimal("88000")).oldPrice(new BigDecimal("112000"))
                        .quantity(160).category(tamLy).active(true)
                        .description("Nghệ thuật sống của người Nhật Bản - bí quyết trường thọ và hạnh phúc. Khám phá triết lý Ikigai - lý do để thức dậy mỗi sáng.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/f9/a0/b1/c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Dinh Dưỡng Cho Người Việt").author("PGS.TS Nguyễn Thị Lâm")
                        .publisher("NXB Y Học").publishYear(2023)
                        .currentPrice(new BigDecimal("125000")).oldPrice(new BigDecimal("158000"))
                        .quantity(75).category(dieuDuong).active(true)
                        .description("Hướng dẫn dinh dưỡng khoa học phù hợp với người Việt Nam. Bao gồm các nguyên tắc ăn uống lành mạnh, thực đơn mẫu và cách phòng ngừa các bệnh liên quan đến dinh dưỡng.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/a0/b1/c2/d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Yoga Cho Người Mới Bắt Đầu").author("BKS Iyengar")
                        .publisher("NXB Phụ Nữ").publishYear(2022)
                        .currentPrice(new BigDecimal("115000")).oldPrice(new BigDecimal("145000"))
                        .quantity(65).category(theDuc).active(true)
                        .description("Hướng dẫn toàn diện về yoga cho người mới bắt đầu. Bao gồm hơn 200 tư thế yoga với hình ảnh minh họa chi tiết và hướng dẫn thở đúng cách.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/b1/c2/d3/e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Chạy Bộ Đúng Cách").author("Jeff Galloway")
                        .publisher("NXB Thể Thao").publishYear(2022)
                        .currentPrice(new BigDecimal("85000")).oldPrice(new BigDecimal("108000"))
                        .quantity(80).category(theDuc).active(true)
                        .description("Hướng dẫn khoa học về cách chạy bộ giảm cân và tăng cường sức khỏe. Jeff Galloway chia sẻ phương pháp chạy bộ an toàn cho mọi lứa tuổi.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/c2/d3/e4/f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Tâm Lý Học Đám Đông").author("Gustave Le Bon")
                        .publisher("NXB Thế Giới").publishYear(2022)
                        .currentPrice(new BigDecimal("72000")).oldPrice(new BigDecimal("92000"))
                        .quantity(95).category(tamLy).active(true)
                        .description("Tác phẩm nền tảng về tâm lý học xã hội. Gustave Le Bon phân tích hành vi của đám đông và những ảnh hưởng của nó đến cá nhân và xã hội.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/d3/e4/f5/a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Nghệ Thuật Tối Giản").author("Marie Kondo")
                        .publisher("NXB Phụ Nữ").publishYear(2023)
                        .currentPrice(new BigDecimal("92000")).oldPrice(new BigDecimal("118000"))
                        .quantity(85).category(sucKhoe).active(true)
                        .description("Phương pháp sắp xếp nhà cửa và cuộc sống của Marie Kondo - chuyên gia tổ chức hàng đầu thế giới. Học cách chỉ giữ lại những thứ 'khơi dậy niềm vui'.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/e4/f5/a6/b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Mindfulness - Sống Tỉnh Thức").author("Thích Nhất Hạnh")
                        .publisher("NXB Tôn Giáo").publishYear(2023)
                        .currentPrice(new BigDecimal("78000")).oldPrice(new BigDecimal("98000"))
                        .quantity(130).category(tamLy).active(true)
                        .description("Hướng dẫn thực hành chánh niệm trong cuộc sống hàng ngày từ Thiền sư Thích Nhất Hạnh. Học cách sống trọn vẹn trong từng khoảnh khắc.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/f5/a6/b7/c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3.jpg")
                        .build());

                    productRepository.save(Product.builder()
                        .title("Sức Khỏe Hoàn Toàn Tự Nhiên").author("Andrew Weil")
                        .publisher("NXB Y Học").publishYear(2022)
                        .currentPrice(new BigDecimal("145000")).oldPrice(new BigDecimal("185000"))
                        .quantity(50).category(dieuDuong).active(true)
                        .description("Hướng dẫn toàn diện về y học tích hợp từ bác sĩ Andrew Weil. Kết hợp y học hiện đại với các phương pháp tự nhiên để đạt được sức khỏe tối ưu.")
                        .image("https://salt.tikicdn.com/cache/w1200/ts/product/a6/b7/c8/d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4.jpg")
                        .build());

                    System.out.println("✅ Khởi tạo 35+ sản phẩm sách mẫu.");
                }
            }

            // =============================================
            // 5. ADDRESSES (cho user mẫu)
            // =============================================
            if (addressRepository.count() == 0 && userRepository.count() > 0) {
                User uAn    = userRepository.findByUsername("nguyenvana").orElse(null);
                User uBich  = userRepository.findByUsername("tranthib").orElse(null);
                User uAnh   = userRepository.findByUsername("lehoanganh").orElse(null);
                User uTuan  = userRepository.findByUsername("phamminhtuan").orElse(null);
                User uMai   = userRepository.findByUsername("vothimai").orElse(null);
                User uLong  = userRepository.findByUsername("dangthanhlong").orElse(null);

                if (uAn != null) {
                    addressRepository.save(Address.builder()
                        .user(uAn).fullName("Nguyễn Văn An").phone("0901234567")
                        .street("12 Nguyễn Huệ")
                        .ward("Phường Bến Nghé").wardId(26734)
                        .district("Quận 1").districtId(760)
                        .province("TP. Hồ Chí Minh").provinceId(79)
                        .isDefault(true).build());

                    addressRepository.save(Address.builder()
                        .user(uAn).fullName("Nguyễn Văn An").phone("0901234567")
                        .street("45 Lê Lợi")
                        .ward("Phường Bến Thành").wardId(26737)
                        .district("Quận 1").districtId(760)
                        .province("TP. Hồ Chí Minh").provinceId(79)
                        .isDefault(false).build());
                }

                if (uBich != null) {
                    addressRepository.save(Address.builder()
                        .user(uBich).fullName("Trần Thị Bích").phone("0902345678")
                        .street("88 Nguyễn Thị Minh Khai")
                        .ward("Phường Đa Kao").wardId(26740)
                        .district("Quận 1").districtId(760)
                        .province("TP. Hồ Chí Minh").provinceId(79)
                        .isDefault(true).build());
                }

                if (uAnh != null) {
                    addressRepository.save(Address.builder()
                        .user(uAnh).fullName("Lê Hoàng Anh").phone("0903456789")
                        .street("23 Hoàng Diệu 2")
                        .ward("Phường Linh Chiểu").wardId(21612)
                        .district("Thành phố Thủ Đức").districtId(769)
                        .province("TP. Hồ Chí Minh").provinceId(79)
                        .isDefault(true).build());
                }

                if (uTuan != null) {
                    addressRepository.save(Address.builder()
                        .user(uTuan).fullName("Phạm Minh Tuấn").phone("0904567890")
                        .street("56 Trần Phú")
                        .ward("Phường Điện Biên").wardId(1806)
                        .district("Quận Ba Đình").districtId(6)
                        .province("Hà Nội").provinceId(1)
                        .isDefault(true).build());
                }

                if (uMai != null) {
                    addressRepository.save(Address.builder()
                        .user(uMai).fullName("Võ Thị Mai").phone("0905678901")
                        .street("34 Nguyễn Tri Phương")
                        .ward("Phường Bình Hiên").wardId(20227)
                        .district("Quận Hải Châu").districtId(489)
                        .province("Đà Nẵng").provinceId(48)
                        .isDefault(true).build());
                }

                if (uLong != null) {
                    addressRepository.save(Address.builder()
                        .user(uLong).fullName("Đặng Thành Long").phone("0906789012")
                        .street("7 Bà Triệu")
                        .ward("Phường Tràng Tiền").wardId(1825)
                        .district("Quận Hoàn Kiếm").districtId(7)
                        .province("Hà Nội").provinceId(1)
                        .isDefault(true).build());
                }

                System.out.println("✅ Khởi tạo địa chỉ giao hàng cho 6 người dùng.");
            }

            // =============================================
            // 6. ORDERS + ORDER DETAILS (dữ liệu đơn hàng mẫu đa dạng)
            // =============================================
            if (orderRepository.count() == 0 && productRepository.count() > 0 && userRepository.count() > 0) {
                User uAn   = userRepository.findByUsername("nguyenvana").orElse(null);
                User uBich = userRepository.findByUsername("tranthib").orElse(null);
                User uAnh  = userRepository.findByUsername("lehoanganh").orElse(null);
                User uTuan = userRepository.findByUsername("phamminhtuan").orElse(null);
                User uMai  = userRepository.findByUsername("vothimai").orElse(null);
                User uLong = userRepository.findByUsername("dangthanhlong").orElse(null);

                OrderStatus choXacNhan = orderStatusRepository.findByStatus("Chờ xác nhận").orElse(null);
                OrderStatus daXacNhan  = orderStatusRepository.findByStatus("Đã xác nhận").orElse(null);
                OrderStatus dangGiao   = orderStatusRepository.findByStatus("Đang giao hàng").orElse(null);
                OrderStatus daGiao     = orderStatusRepository.findByStatus("Đã giao hàng").orElse(null);
                OrderStatus daHuy      = orderStatusRepository.findByStatus("Đã hủy").orElse(null);

                List<Product> all = productRepository.findAll();
                if (all.size() >= 10 && uAn != null && daGiao != null) {

                    // ── Đơn 1: Nguyễn Văn An – Đã giao (COD)
                    Order o1 = orderRepository.save(Order.builder()
                        .user(uAn).fullName("Nguyễn Văn An").email("nguyenvana@gmail.com")
                        .phone("0901234567")
                        .address("12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                        .note("Giao giờ hành chính").paymentMethod("COD").paymentStatus(false)
                        .totalAmount(new BigDecimal("253000")).shippingCost(new BigDecimal("30000"))
                        .orderStatus(daGiao).build());
                    orderDetailRepository.save(OrderDetail.builder().order(o1).product(all.get(0)).quantity(1).price(all.get(0).getCurrentPrice()).build());
                    orderDetailRepository.save(OrderDetail.builder().order(o1).product(all.get(17)).quantity(1).price(all.get(17).getCurrentPrice()).build());
                    orderDetailRepository.save(OrderDetail.builder().order(o1).product(all.get(29)).quantity(1).price(all.get(29).getCurrentPrice()).build());

                    // ── Đơn 2: Nguyễn Văn An – Đã giao (BANKING)
                    Order o2 = orderRepository.save(Order.builder()
                        .user(uAn).fullName("Nguyễn Văn An").email("nguyenvana@gmail.com")
                        .phone("0901234567")
                        .address("12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                        .paymentMethod("BANKING").paymentStatus(true)
                        .totalAmount(new BigDecimal("173000")).shippingCost(new BigDecimal("30000"))
                        .orderStatus(daGiao).build());
                    orderDetailRepository.save(OrderDetail.builder().order(o2).product(all.get(2)).quantity(1).price(all.get(2).getCurrentPrice()).build());
                    orderDetailRepository.save(OrderDetail.builder().order(o2).product(all.get(22)).quantity(1).price(all.get(22).getCurrentPrice()).build());

                    // ── Đơn 3: Nguyễn Văn An – Chờ xác nhận (COD)
                    if (choXacNhan != null) {
                        Order o3 = orderRepository.save(Order.builder()
                            .user(uAn).fullName("Nguyễn Văn An").email("nguyenvana@gmail.com")
                            .phone("0901234567")
                            .address("12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                            .paymentMethod("COD").paymentStatus(false)
                            .totalAmount(new BigDecimal("290000")).shippingCost(new BigDecimal("30000"))
                            .orderStatus(choXacNhan).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o3).product(all.get(7)).quantity(1).price(all.get(7).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o3).product(all.get(8)).quantity(1).price(all.get(8).getCurrentPrice()).build());
                    }

                    // ── Đơn 4: Trần Thị Bích – Đã giao
                    if (uBich != null) {
                        Order o4 = orderRepository.save(Order.builder()
                            .user(uBich).fullName("Trần Thị Bích").email("tranthib@gmail.com")
                            .phone("0902345678")
                            .address("88 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh")
                            .note("Đóng gói cẩn thận").paymentMethod("COD").paymentStatus(false)
                            .totalAmount(new BigDecimal("255000")).shippingCost(new BigDecimal("30000"))
                            .orderStatus(daGiao).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o4).product(all.get(13)).quantity(1).price(all.get(13).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o4).product(all.get(24)).quantity(1).price(all.get(24).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o4).product(all.get(21)).quantity(1).price(all.get(21).getCurrentPrice()).build());

                        // ── Đơn 5: Trần Thị Bích – Đang giao
                        if (dangGiao != null) {
                            Order o5 = orderRepository.save(Order.builder()
                                .user(uBich).fullName("Trần Thị Bích").email("tranthib@gmail.com")
                                .phone("0902345678")
                                .address("88 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh")
                                .paymentMethod("BANKING").paymentStatus(true)
                                .totalAmount(new BigDecimal("212000")).shippingCost(new BigDecimal("30000"))
                                .orderStatus(dangGiao).build());
                            orderDetailRepository.save(OrderDetail.builder().order(o5).product(all.get(25)).quantity(1).price(all.get(25).getCurrentPrice()).build());
                            orderDetailRepository.save(OrderDetail.builder().order(o5).product(all.get(19)).quantity(1).price(all.get(19).getCurrentPrice()).build());
                            orderDetailRepository.save(OrderDetail.builder().order(o5).product(all.get(20)).quantity(1).price(all.get(20).getCurrentPrice()).build());
                        }
                    }

                    // ── Đơn 6: Lê Hoàng Anh – Đã giao
                    if (uAnh != null) {
                        Order o6 = orderRepository.save(Order.builder()
                            .user(uAnh).fullName("Lê Hoàng Anh").email("lehoanganh@gmail.com")
                            .phone("0903456789")
                            .address("23 Hoàng Diệu 2, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh")
                            .paymentMethod("COD").paymentStatus(false)
                            .totalAmount(new BigDecimal("385000")).shippingCost(new BigDecimal("30000"))
                            .orderStatus(daGiao).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o6).product(all.get(14)).quantity(1).price(all.get(14).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o6).product(all.get(6)).quantity(1).price(all.get(6).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o6).product(all.get(15)).quantity(1).price(all.get(15).getCurrentPrice()).build());

                        // ── Đơn 7: Lê Hoàng Anh – Đã xác nhận
                        if (daXacNhan != null) {
                            Order o7 = orderRepository.save(Order.builder()
                                .user(uAnh).fullName("Lê Hoàng Anh").email("lehoanganh@gmail.com")
                                .phone("0903456789")
                                .address("23 Hoàng Diệu 2, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh")
                                .note("Gọi trước khi giao").paymentMethod("BANKING").paymentStatus(true)
                                .totalAmount(new BigDecimal("215000")).shippingCost(new BigDecimal("30000"))
                                .orderStatus(daXacNhan).build());
                            orderDetailRepository.save(OrderDetail.builder().order(o7).product(all.get(12)).quantity(1).price(all.get(12).getCurrentPrice()).build());
                        }
                    }

                    // ── Đơn 8: Phạm Minh Tuấn (Hà Nội) – Đã giao (BANKING)
                    if (uTuan != null) {
                        Order o8 = orderRepository.save(Order.builder()
                            .user(uTuan).fullName("Phạm Minh Tuấn").email("phamminhtuan@gmail.com")
                            .phone("0904567890")
                            .address("56 Trần Phú, Phường Điện Biên, Quận Ba Đình, Hà Nội")
                            .paymentMethod("BANKING").paymentStatus(true)
                            .totalAmount(new BigDecimal("387000")).shippingCost(new BigDecimal("40000"))
                            .orderStatus(daGiao).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o8).product(all.get(16)).quantity(1).price(all.get(16).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o8).product(all.get(32)).quantity(1).price(all.get(32).getCurrentPrice()).build());

                        // ── Đơn 9: Phạm Minh Tuấn – Đã hủy
                        if (daHuy != null) {
                            Order o9 = orderRepository.save(Order.builder()
                                .user(uTuan).fullName("Phạm Minh Tuấn").email("phamminhtuan@gmail.com")
                                .phone("0904567890")
                                .address("56 Trần Phú, Phường Điện Biên, Quận Ba Đình, Hà Nội")
                                .note("Mua làm quà tặng").paymentMethod("COD").paymentStatus(false)
                                .totalAmount(new BigDecimal("278000")).shippingCost(new BigDecimal("40000"))
                                .orderStatus(daHuy).build());
                            orderDetailRepository.save(OrderDetail.builder().order(o9).product(all.get(29)).quantity(1).price(all.get(29).getCurrentPrice()).build());
                            orderDetailRepository.save(OrderDetail.builder().order(o9).product(all.get(26)).quantity(1).price(all.get(26).getCurrentPrice()).build());
                            orderDetailRepository.save(OrderDetail.builder().order(o9).product(all.get(21)).quantity(1).price(all.get(21).getCurrentPrice()).build());
                        }
                    }

                    // ── Đơn 10: Võ Thị Mai (Đà Nẵng) – Đã giao
                    if (uMai != null) {
                        Order o10 = orderRepository.save(Order.builder()
                            .user(uMai).fullName("Võ Thị Mai").email("vothimai@gmail.com")
                            .phone("0905678901")
                            .address("34 Nguyễn Tri Phương, Phường Bình Hiên, Quận Hải Châu, Đà Nẵng")
                            .paymentMethod("COD").paymentStatus(false)
                            .totalAmount(new BigDecimal("226000")).shippingCost(new BigDecimal("40000"))
                            .orderStatus(daGiao).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o10).product(all.get(11)).quantity(1).price(all.get(11).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o10).product(all.get(33)).quantity(1).price(all.get(33).getCurrentPrice()).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o10).product(all.get(31)).quantity(1).price(all.get(31).getCurrentPrice()).build());
                    }

                    // ── Đơn 11: Đặng Thành Long (Hà Nội) – Đã giao
                    if (uLong != null) {
                        Order o11 = orderRepository.save(Order.builder()
                            .user(uLong).fullName("Đặng Thành Long").email("dangthanhlong@gmail.com")
                            .phone("0906789012")
                            .address("7 Bà Triệu, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội")
                            .paymentMethod("BANKING").paymentStatus(true)
                            .totalAmount(new BigDecimal("339000")).shippingCost(new BigDecimal("40000"))
                            .orderStatus(daGiao).build());
                        orderDetailRepository.save(OrderDetail.builder().order(o11).product(all.get(16)).quantity(1).price(all.get(16).getCurrentPrice()).build());
                    }

                    System.out.println("✅ Khởi tạo 11 đơn hàng mẫu đa dạng trạng thái.");
                }
            }

            // =============================================
            // 7. REVIEWS (đánh giá mẫu)
            // =============================================
            if (reviewRepository.count() == 0 && productRepository.count() > 0 && userRepository.count() > 0) {
                List<Product> products = productRepository.findAll();
                List<User> users = userRepository.findAll().stream()
                        .filter(u -> u.getRole().equals("USER")).toList();

                if (!products.isEmpty() && !users.isEmpty()) {
                    // Dữ liệu review theo từng sách cụ thể
                    Object[][][] bookReviews = {
                        // [productIndex][review] = {userIndex, rating, comment}
                        { // Đắc Nhân Tâm (index 0)
                            {0, 5, "Cuốn sách thay đổi cuộc đời tôi! Cách viết dễ đọc, nhiều ví dụ thực tế. Đọc xong áp dụng ngay vào công việc và thấy mối quan hệ với đồng nghiệp tốt hơn hẳn."},
                            {1, 4, "Sách rất hay và bổ ích, nội dung dễ hiểu. Tuy nhiên một số ví dụ hơi cũ vì sách viết từ lâu rồi. Nhưng nhìn chung vẫn rất đáng đọc!"},
                            {2, 5, "Đây là lần thứ 3 tôi đọc cuốn này. Mỗi lần đọc lại thấy thêm điều mới. Sách giao đúng hạn, bìa sách đẹp, chất lượng in tốt."},
                        },
                        { // Người Giàu Có Nhất Thành Babylon (index 1)
                            {3, 4, "Những câu chuyện ngụ ngôn về tài chính từ Babylon rất dễ đọc và thú vị. Học được nhiều bài học hay về tiết kiệm và đầu tư."},
                            {0, 5, "Đọc xong cuốn này tôi bắt đầu tiết kiệm 10% thu nhập mỗi tháng. Hiệu quả thật sự! Khuyến khích người trẻ nên đọc ngay."},
                        },
                        { // Cha Giàu Cha Nghèo (index 2)
                            {0, 5, "Cuốn sách thay đổi hoàn toàn cách tôi nhìn về tiền bạc và tài sản. Sau khi đọc, tôi bắt đầu tìm hiểu về đầu tư nghiêm túc hơn."},
                            {4, 3, "Sách có nhiều ý tưởng hay về tư duy tài chính nhưng một số lời khuyên không phù hợp với bối cảnh Việt Nam. Đọc để tham khảo thêm góc nhìn."},
                        },
                        { // Nghĩ Giàu Làm Giàu (index 3)
                            {1, 4, "13 nguyên tắc thành công của Napoleon Hill vẫn còn nguyên giá trị dù đã hơn 80 năm. Sách truyền động lực rất mạnh."},
                            {2, 4, "Nội dung sâu sắc, nhiều bài học quý giá. Tuy nhiên cần kiên nhẫn đọc vì sách dày và đôi chỗ lặp lại."},
                        },
                        { // Tư Duy Phản Biện (index 4)
                            {3, 5, "Đây là cuốn sách tôi ước mình đọc sớm hơn 10 năm! Giúp tư duy rõ ràng và phân tích vấn đề tốt hơn nhiều."},
                        },
                        { // Khởi Nghiệp Tinh Gọn (index 5)
                            {4, 5, "Gần như là 'kinh thánh' cho dân startup! Phương pháp Lean Startup thực sự hiệu quả và đã được kiểm chứng. Đọc đi đọc lại vẫn thấy học được điều mới."},
                            {0, 4, "Cực kỳ thực tế và áp dụng được ngay. Cuốn sách này đã thay đổi hoàn toàn cách tôi tiếp cận dự án khởi nghiệp của mình."},
                        },
                        { // Marketing 4.0 (index 6)
                            {3, 4, "Philip Kotler viết rất bài bản và có hệ thống. Cung cấp nhiều framework hữu ích cho marketing số. Cần có kiến thức nền để đọc hiểu tốt hơn."},
                        },
                        { // Zero To One (index 7)
                            {2, 5, "Góc nhìn độc đáo về khởi nghiệp mà tôi chưa từng thấy ở sách nào. Peter Thiel thách thức mọi suy nghĩ thông thường về cạnh tranh và độc quyền."},
                        },
                        { // Tư Duy Nhanh Và Chậm (index 8)
                            {0, 5, "Kahneman giải thích cực kỳ thú vị về cách não bộ con người hoạt động. Đọc xong nhìn nhận mọi quyết định của mình rất khác."},
                            {1, 4, "Sách học thuật nhưng rất dễ hiểu nhờ nhiều ví dụ minh họa. Nặng nhưng xứng đáng đọc hết."},
                        },
                        { // Sapiens (index 13 - nhưng ở đây list theo thứ tự save nên index 13)
                            {1, 5, "Cuốn sách mở mang tầm mắt về lịch sử nhân loại! Tác giả có cái nhìn rất độc đáo. Đọc xong hiểu hơn rất nhiều về thế giới xung quanh mình."},
                            {2, 4, "Sách cực kỳ hay và sâu sắc. Nội dung đề cập đến nhiều lĩnh vực từ sinh học, lịch sử đến tâm lý. Đọc hết cuốn này mất khá nhiều thời gian."},
                        },
                        { // Nhà Giả Kim (index 17)
                            {0, 5, "Một cuốn sách tuyệt vời! Câu chuyện đơn giản nhưng chứa đựng nhiều triết lý sâu sắc về theo đuổi ước mơ. Tôi đã khóc ở đoạn cuối."},
                            {2, 4, "Sách hay, ngôn ngữ thơ mộng và cuốn hút. Phù hợp đọc khi muốn tìm lại động lực sống."},
                            {4, 5, "Cuốn sách kinh điển không bao giờ lỗi thời. Đọc lần đầu năm 18 tuổi, đọc lại năm 28 tuổi cảm xúc hoàn toàn khác."},
                        },
                        { // Mắt Biếc (index 24)
                            {1, 5, "Cuốn sách khiến tôi khóc hết nước mắt! Nguyễn Nhật Ánh viết về tuổi thơ và tình yêu đầu đời rất chân thực và xúc động."},
                            {3, 4, "Văn phong dịu dàng, câu chuyện buồn nhưng đẹp. Nhân vật Ngạn và Hà Lan khiến người đọc nhớ lại tuổi học trò của chính mình."},
                        },
                        { // Sức Mạnh Của Thói Quen (index 29)
                            {0, 5, "Cuốn sách giải thích rất khoa học về cơ chế hình thành thói quen. Tôi đã áp dụng và thực sự thấy kết quả sau 3 tháng!"},
                            {4, 5, "Sau khi đọc xong, tôi đã thành công bỏ thói quen xấu và hình thành thói quen tập thể dục đều đặn. Cảm ơn cuốn sách này!"},
                        },
                        { // Ikigai (index 31)
                            {3, 4, "Cuốn sách truyền cảm hứng về nghệ thuật sống của người Nhật. Nội dung nhẹ nhàng nhưng chứa đựng nhiều triết lý sâu sắc. Đọc xong thấy bình yên hơn."},
                        },
                        { // Harry Potter (index 28)
                            {3, 5, "Mua cho con đọc nhưng mình cũng đọc lại, vẫn hay như hồi nhỏ! Sách in đẹp, bìa cứng chắc chắn. Con rất thích và đòi mua tiếp các phần sau."},
                            {2, 5, "Sách huyền thoại! Đã đọc từ nhỏ giờ mua lại bản mới. Chất lượng in ấn của NXB Trẻ rất tốt, dịch thuật mượt mà và dễ hiểu."},
                        },
                    };

                    int[] productIdxMap = {0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 17, 24, 29, 31, 28};
                    for (int i = 0; i < bookReviews.length && i < productIdxMap.length; i++) {
                        int pIdx = productIdxMap[i];
                        if (pIdx >= products.size()) continue;
                        Product reviewProduct = products.get(pIdx);
                        for (Object[] rv : bookReviews[i]) {
                            int uIdx = (int) rv[0];
                            if (uIdx >= users.size()) uIdx = 0;
                            reviewRepository.save(Review.builder()
                                .product(reviewProduct)
                                .user(users.get(uIdx))
                                .rating((int) rv[1])
                                .comment((String) rv[2])
                                .status(true)
                                .build());
                        }
                    }
                    System.out.println("✅ Khởi tạo đánh giá sản phẩm thực tế và chi tiết.");
                }
            }

            // Cập nhật đường dẫn ảnh bìa trực tuyến chất lượng cao từ Tiki cho sách văn học/kinh doanh, và Unsplash cho giáo trình
            List<Product> allProducts = productRepository.findAll();
            for (Product p : allProducts) {
                String title = p.getTitle().toLowerCase();
                String newImg = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"; // default cover

                if (title.contains("đắc nhân tâm")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/d/a/dac-nhan-tam.jpg";
                } else if (title.contains("babylon")) {
                    newImg = "https://salt.tikicdn.com/ts/product/23/f8/75/5e90d6e0eabaebd068c815cf1c1f7396.jpg";
                } else if (title.contains("cha giàu")) {
                    newImg = "https://salt.tikicdn.com/ts/product/17/02/d1/52dde080f00d414a2d441c544c76d9c9.jpg";
                } else if (title.contains("làm giàu")) {
                    newImg = "https://salt.tikicdn.com/ts/product/04/d4/da/82f00d6a08d3daec807940f3a80973e9.png";
                } else if (title.contains("phản biện")) {
                    newImg = "https://salt.tikicdn.com/ts/product/fc/1e/80/ecf851cf939adc97a770671c619f4ebd.jpg";
                } else if (title.contains("tinh gọn")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/k/h/khoi-nghiep-tinh-gon.jpg";
                } else if (title.contains("zero to one")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/z/e/zero-to-one.jpg";
                } else if (title.contains("marketing")) {
                    newImg = "https://salt.tikicdn.com/ts/product/cc/94/c8/334dda7dc15556750bea719cc6174469.jpg";
                } else if (title.contains("nhanh và chậm")) {
                    newImg = "https://salt.tikicdn.com/ts/product/d2/5a/00/479b787ba33d3933c0619ea2441e2a7d.png";
                } else if (title.contains("giải tích 1")) {
                    newImg = "https://salt.tikicdn.com/ts/product/78/ac/77/f33feea6316e9a2d04a3c074adee170a.jpg";
                } else if (title.contains("tuyến tính")) {
                    newImg = "https://salt.tikicdn.com/ts/product/67/08/79/f99c6760c3035997c6f27103a8efa8cf.jpg";
                } else if (title.contains("giao tiếp hàng ngày")) {
                    newImg = "https://salt.tikicdn.com/ts/product/6e/34/31/a3df6370867b75f65331caa92f1aef96.jpg";
                } else if (title.contains("toeic")) {
                    newImg = "https://salt.tikicdn.com/ts/product/1a/0e/f4/3a1f86a93da0020eaf2553b51efeecd1.png";
                } else if (title.contains("sapiens")) {
                    newImg = "https://salt.tikicdn.com/ts/product/58/e2/0a/f285d857f6e07663f70747cb988a82d0.jpg";
                } else if (title.contains("homo deus")) {
                    newImg = "https://salt.tikicdn.com/ts/product/3a/0c/b1/7b2e911293da0020eaf2553b51efeecd1.jpg";
                } else if (title.contains("vật lý")) {
                    newImg = "https://salt.tikicdn.com/ts/product/0c/8a/fa/d8702b79e701bb4a648b2eb681ef546c.jpg";
                } else if (title.contains("văn minh")) {
                    newImg = "https://salt.tikicdn.com/ts/product/cd/2a/8d/fa786966cf40775d796696b99be2df55.jpg";
                } else if (title.contains("giả kim")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/n/h/nha-gia-kim.jpg";
                } else if (title.contains("dế mèn")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/d/e/de-men-phieu-luu-ky.jpg";
                } else if (title.contains("số đỏ")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/s/o/so-do.jpg";
                } else if (title.contains("chí phèo")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/c/h/chi-pheo.jpg";
                } else if (title.contains("tắt đèn")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/t/a/tat-den.jpg";
                } else if (title.contains("harry potter")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/h/a/harry-potter-va-hon-da-phu-thuy.jpg";
                } else if (title.contains("kiếp nhân sinh")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/m/u/muon-kiep-nhan-sinh.jpg";
                } else if (title.contains("bố già")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/b/o/bo-gia.jpg";
                } else if (title.contains("không còn ai")) {
                    newImg = "https://salt.tikicdn.com/ts/product/dd/e8/3f/82c3c6f2c7cb6440c9bc0bf872bcf7e8.jpg";
                } else if (title.contains("namiya")) {
                    newImg = "https://salt.tikicdn.com/ts/product/ea/7e/e6/9e6ccf40775d796696b99be2df553edf.jpg";
                } else if (title.contains("hoa vàng")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/t/o/toi-thay-hoa-vang-tren-co-xanh.jpg";
                } else if (title.contains("mắt biếc")) {
                    newImg = "https://salt.tikicdn.com/cache/750x750/media/catalog/product/m/a/mat-biec.jpg";
                } else if (title.contains("đất rừng")) {
                    newImg = "https://salt.tikicdn.com/ts/product/79/e7/01/bb4a648b2eb681ef546c8d8702b79e9d.jpg";
                } else if (title.contains("thói quen")) {
                    newImg = "https://salt.tikicdn.com/ts/product/0c/83/a5/d8702b79e701bb4a648b2eb681ef546c.jpg";
                } else if (title.contains("ngủ dài")) {
                    newImg = "https://salt.tikicdn.com/ts/product/d0/5c/41/508ca2cfc7ffc5244d4b319c0c0262ad.jpg";
                } else if (title.contains("ikigai")) {
                    newImg = "https://salt.tikicdn.com/ts/product/b6/4c/32/7ee69e6ccf40775d796696b99be2df55.jpg";
                } else if (title.contains("đám đông")) {
                    newImg = "https://salt.tikicdn.com/ts/product/9e/d8/79/e701bb4a648b2eb681ef546c8d8702b7.jpg";
                } else if (title.contains("mindfulness") || title.contains("tỉnh thức") || title.contains("chánh niệm")) {
                    newImg = "https://salt.tikicdn.com/ts/product/d6/2c/e7/e4d76504e86684c4f785fcd77fd42948.png";
                } else if (title.contains("dinh dưỡng")) {
                    newImg = "https://salt.tikicdn.com/ts/product/89/3e/df/7ee69e6ccf40775d796696b99be2df55.jpg";
                } else if (title.contains("hoàn toàn tự nhiên") || title.contains("sức khỏe hoàn toàn")) {
                    newImg = "https://salt.tikicdn.com/ts/product/2e/dd/e8/3f82c3c6f2c7cb6440c9bc0bf872bcf7.jpg";
                } else if (title.contains("yoga")) {
                    newImg = "https://salt.tikicdn.com/ts/product/4c/83/8f/d8702b79e701bb4a648b2eb681ef546c.jpg";
                } else if (title.contains("chạy bộ")) {
                    newImg = "https://salt.tikicdn.com/ts/product/d8/79/e7/01bb4a648b2eb681ef546c8d8702b79e.jpg";
                } else if (title.contains("tối giản")) {
                    newImg = "https://salt.tikicdn.com/ts/product/0c/83/a5/d8702b79e701bb4a648b2eb681ef546c.jpg";
                }

                p.setImage(newImg);
                productRepository.save(p);
            }
            System.out.println("🔧 Đã tự động cập nhật hình ảnh Tiki trực tuyến tương ứng cho từng đầu sách.");

            System.out.println("🚀 BookStore Database đã được khởi tạo thành công!");
            System.out.println("📋 Tài khoản: admin/admin123 | nguyenvana/123456");
        };
    }
}
