package com.bookstore.service;

import com.bookstore.dto.OrderDto;
import com.bookstore.model.*;
import com.bookstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(Long userId, OrderDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        OrderStatus pendingStatus = orderStatusRepository.findByStatus("Chờ xác nhận")
                .orElseGet(() -> orderStatusRepository.save(
                        OrderStatus.builder().status("Chờ xác nhận").build()));

        Order order = Order.builder()
                .user(user)
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .note(dto.getNote())
                .paymentMethod(dto.getPaymentMethod())
                .paymentStatus(dto.isPaymentStatus())
                .totalAmount(dto.getTotalAmount())
                .shippingCost(dto.getShippingCost())
                .orderStatus(pendingStatus)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Lưu chi tiết đơn hàng
        List<OrderDetail> details = new ArrayList<>();
        for (OrderDto.OrderItemDto item : dto.getOrderItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy sản phẩm id: " + item.getProductId()));

            // Giảm số lượng tồn kho
            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm '" + product.getTitle() + "' không đủ số lượng!");
            }
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);

            details.add(OrderDetail.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .build());
        }
        orderDetailRepository.saveAll(details);
        savedOrder.setOrderDetails(details);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng id: " + id));
    }

    public Order updateOrderStatus(Long orderId, Long statusId) {
        Order order = getOrderById(orderId);
        OrderStatus status = orderStatusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái id: " + statusId));
        order.setOrderStatus(status);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(
                org.springframework.data.domain.Sort.by("createdAt").descending());
    }

    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }
}
