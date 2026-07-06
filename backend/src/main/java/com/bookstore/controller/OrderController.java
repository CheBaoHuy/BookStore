package com.bookstore.controller;

import com.bookstore.dto.OrderDto;
import com.bookstore.dto.RevenueTrendPointDto;
import com.bookstore.model.Order;
import com.bookstore.model.OrderStatus;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /** POST /api/orders?userId={userId}
     *  Tạo đơn hàng mới */
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestParam Long userId,
            @Valid @RequestBody OrderDto dto) {
        try {
            Order order = orderService.createOrder(userId, dto);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** GET /api/orders/user/{userId}
     *  Lịch sử đơn hàng của người dùng */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    /** GET /api/orders/{id}
     *  Chi tiết đơn hàng */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** PUT /api/orders/{id}/status?statusId={statusId}
     *  Cập nhật trạng thái đơn hàng (Admin) */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Long statusId) {
        try {
            Order order = orderService.updateOrderStatus(id, statusId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** PUT /api/orders/{id}/payment-status?paid={paid}
     *  Cập nhật trạng thái thanh toán đơn hàng (Admin) */
    @PutMapping("/{id}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderPaymentStatus(
            @PathVariable Long id,
            @RequestParam boolean paid) {
        try {
            Order order = orderService.updateOrderPaymentStatus(id, paid);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** GET /api/orders  (Admin only)
     *  Tất cả đơn hàng */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /** GET /api/orders/statuses
     *  Danh sách trạng thái đơn hàng */
    @GetMapping("/statuses")
    public ResponseEntity<List<OrderStatus>> getOrderStatuses() {
        return ResponseEntity.ok(orderService.getAllOrderStatuses());
    }

    /** GET /api/orders/revenue-trend?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd
     *  Thống kê xu hướng doanh thu theo ngày (Admin) */
    @GetMapping("/revenue-trend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRevenueTrend(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId) {
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ngày bắt đầu không được lớn hơn ngày kết thúc."));
        }

        List<RevenueTrendPointDto> revenueTrend = orderService.getRevenueTrendByDate(startDate, endDate, categoryId);
        return ResponseEntity.ok(revenueTrend);
    }
}
