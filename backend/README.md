# BookStore Backend API

Backend cho ứng dụng BookStore được xây dựng với **Spring Boot 3**, **Spring Security (JWT)** và **MySQL 8**.

## 🛠️ Tech Stack

| Công nghệ | Version |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.5 |
| Spring Security | 6.x |
| Spring Data JPA | 3.x |
| MySQL | 8.x |
| JWT (jjwt) | 0.12.3 |
| Lombok | Latest |
| Maven | 3.x |

## 📁 Cấu trúc dự án

```
backend/
├── src/main/java/com/bookstore/
│   ├── BookstoreApplication.java       # Entry point
│   ├── config/
│   │   ├── SecurityConfig.java         # Spring Security + JWT config
│   │   ├── CorsConfig.java             # CORS cho React frontend
│   │   └── DataInitializer.java        # Seed data khi khởi động
│   ├── controller/
│   │   ├── AuthController.java         # /api/auth/*
│   │   ├── ProductController.java      # /api/products/*, /api/categories/*
│   │   ├── OrderController.java        # /api/orders/*
│   │   ├── ReviewController.java       # /api/reviews/*
│   │   └── AddressController.java      # /api/addresses/*
│   ├── model/                          # JPA Entities
│   ├── dto/                            # Data Transfer Objects
│   ├── repository/                     # Spring Data JPA Repositories
│   ├── service/                        # Business Logic
│   ├── security/                       # JWT Filter, UserDetailsService
│   └── exception/                      # Global Exception Handler
└── src/main/resources/
    └── application.properties          # Cấu hình DB, JWT, Mail
```

## ⚙️ Cài đặt và chạy

### 1. Yêu cầu

- Java 17+
- MySQL 8.x đang chạy
- Maven 3.x

### 2. Tạo database MySQL

```sql
CREATE DATABASE bookstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Cấu hình `application.properties`

Mở file `src/main/resources/application.properties` và chỉnh sửa:

```properties
spring.datasource.username=root        # MySQL username của bạn
spring.datasource.password=root        # MySQL password của bạn
```

### 4. Chạy ứng dụng

```bash
mvn spring-boot:run
```

Hoặc build jar và chạy:

```bash
mvn clean package -DskipTests
java -jar target/bookstore-backend-1.0.0.jar
```

Server sẽ chạy tại: `http://localhost:8080`

### 5. Tài khoản mặc định (seed data)

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `user1` | `user123` | USER |

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản | Public |
| POST | `/api/auth/login` | Đăng nhập → JWT token | Public |
| POST | `/api/auth/forgot-password` | Quên mật khẩu | Public |
| GET | `/api/auth/me` | Thông tin tài khoản | Required |
| PUT | `/api/auth/profile` | Cập nhật thông tin | Required |

**Login Request:**
```json
{
  "username": "user1",
  "password": "user123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGc...",
  "tokenType": "Bearer",
  "userId": 2,
  "username": "user1",
  "email": "user1@example.com",
  "role": "USER",
  "fullName": "Nguyễn Văn A"
}
```

---

### 📚 Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | Danh sách sách (phân trang) | Public |
| GET | `/api/products?keyword=abc` | Tìm kiếm sách | Public |
| GET | `/api/products?categoryId=1` | Sách theo danh mục | Public |
| GET | `/api/products/{id}` | Chi tiết sách | Public |
| POST | `/api/products` | Thêm sách | ADMIN |
| PUT | `/api/products/{id}` | Sửa sách | ADMIN |
| DELETE | `/api/products/{id}` | Xóa sách | ADMIN |

**Query params cho GET /api/products:**
- `page` (default: 0)
- `size` (default: 12)
- `sortBy` (default: createdAt)
- `sortDir` (default: desc)
- `keyword` — tìm theo tên, tác giả
- `categoryId` — lọc theo danh mục
- `categoryName` — lọc theo tên danh mục

---

### 📂 Categories

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/categories` | Danh sách danh mục | Public |
| GET | `/api/categories/{id}` | Chi tiết danh mục | Public |
| GET | `/api/categories/{id}/products` | Sách theo danh mục | Public |
| POST | `/api/categories` | Thêm danh mục | ADMIN |
| PUT | `/api/categories/{id}` | Sửa danh mục | ADMIN |

---

### 🛒 Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders?userId={id}` | Tạo đơn hàng | Required |
| GET | `/api/orders/user/{userId}` | Lịch sử đơn hàng | Required |
| GET | `/api/orders/{id}` | Chi tiết đơn hàng | Required |
| PUT | `/api/orders/{id}/status?statusId={id}` | Cập nhật trạng thái | ADMIN |
| GET | `/api/orders` | Tất cả đơn hàng | ADMIN |
| GET | `/api/orders/statuses` | Danh sách trạng thái | Public |

**Order Request:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0901234567",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "paymentMethod": "COD",
  "shippingCost": 30000,
  "totalAmount": 200000,
  "orderItems": [
    { "productId": 1, "quantity": 2, "price": 89000 }
  ]
}
```

---

### ⭐ Reviews

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products/{id}/reviews` | Đánh giá sản phẩm | Public |
| POST | `/api/reviews` | Thêm đánh giá | Required |

---

### 📍 Addresses

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/addresses/user/{userId}` | Địa chỉ giao hàng | Required |
| POST | `/api/addresses?userId={id}` | Thêm địa chỉ | Required |
| PUT | `/api/addresses/{id}?userId={id}` | Sửa địa chỉ | Required |
| DELETE | `/api/addresses/{id}?userId={id}` | Xóa địa chỉ | Required |

---

## 🔑 Authentication Header

Sau khi đăng nhập, thêm header vào mọi request cần xác thực:

```
Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

Bảng được tự động tạo khi khởi động (`spring.jpa.hibernate.ddl-auto=update`):

- `users` — Tài khoản người dùng
- `categories` — Danh mục sách (hỗ trợ danh mục cha/con)
- `products` — Sản phẩm sách
- `order_statuses` — Trạng thái đơn hàng
- `orders` — Đơn hàng
- `order_details` — Chi tiết đơn hàng
- `reviews` — Đánh giá sản phẩm
- `addresses` — Địa chỉ giao hàng

---

## 🚀 Kết nối với Frontend

Frontend React chạy tại `http://localhost:3000`, backend tại `http://localhost:8080`.

CORS đã được cấu hình cho phép frontend gọi API. Trong frontend, đặt base URL:
```
http://localhost:8080
```
