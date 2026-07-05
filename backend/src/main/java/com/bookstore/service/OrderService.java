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
    private NotificationService notificationService;

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

        Long oldStatusId = order.getOrderStatus() != null ? order.getOrderStatus().getId() : 0L;
        boolean oldPaymentStatus = order.isPaymentStatus();

        order.setOrderStatus(status);

        // Automatically set paymentStatus = true if order is successfully delivered (statusId = 4)
        if (statusId == 4) {
            order.setPaymentStatus(true);
        }

        Order savedOrder = orderRepository.save(order);

        // Trigger shipping notification (statusId = 3)
        if (oldStatusId != 3 && statusId == 3) {
            triggerShippingNotification(savedOrder);
        }

        // Trigger delivery success notification (statusId = 4)
        if (oldStatusId != 4 && statusId == 4) {
            triggerDeliveredNotification(savedOrder);
        }

        // Trigger payment success notification if changed to true
        if (!oldPaymentStatus && savedOrder.isPaymentStatus()) {
            triggerPaymentSuccessNotification(savedOrder);
        }

        return savedOrder;
    }

    public Order updateOrderPaymentStatus(Long orderId, boolean paymentStatus) {
        Order order = getOrderById(orderId);
        boolean oldPaymentStatus = order.isPaymentStatus();
        order.setPaymentStatus(paymentStatus);
        Order savedOrder = orderRepository.save(order);

        if (!oldPaymentStatus && paymentStatus) {
            triggerPaymentSuccessNotification(savedOrder);
        }

        return savedOrder;
    }

    private void triggerShippingNotification(Order order) {
        String title = "Đơn hàng #" + order.getId() + " đang được giao";
        String message = String.format("Đơn hàng #%d của bạn đang được giao. Người giao hàng sẽ sớm liên hệ với bạn.", order.getId());

        // In-app notification
        notificationService.createNotification(order.getUser(), title, message);

        // Email notification
        String emailContent = String.format(
                "Xin chào %s,\n\n" +
                "Đơn hàng #%d của bạn đã được chuyển sang trạng thái đang giao hàng và đang trên đường tới địa chỉ của bạn.\n\n" +
                "Thông tin nhận hàng:\n" +
                "- Địa chỉ: %s\n" +
                "- Số điện thoại: %s\n" +
                "- Tổng thanh toán: %,.0f VNĐ\n\n" +
                "Cảm ơn bạn đã mua hàng tại BookStore!\nTrân trọng.",
                order.getFullName(), order.getId(), order.getAddress(), order.getPhone(), order.getTotalAmount()
        );
        notificationService.sendEmailNotification(order.getEmail(), "BookStore - Đơn hàng đang giao", emailContent);
    }

    private void triggerDeliveredNotification(Order order) {
        String title = "Đơn hàng #" + order.getId() + " giao thành công";
        String message = String.format("Đơn hàng #%d của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại BookStore!", order.getId());

        // In-app notification
        notificationService.createNotification(order.getUser(), title, message);

        // Email notification
        String emailContent = String.format(
                "Xin chào %s,\n\n" +
                "Đơn hàng #%d của bạn đã được giao thành công.\n\n" +
                "Thông tin đơn hàng:\n" +
                "- Mã đơn hàng: #%d\n" +
                "- Tổng thanh toán: %,.0f VNĐ\n\n" +
                "Cảm ơn bạn đã tin tưởng và đồng hành cùng BookStore!\nTrân trọng.",
                order.getFullName(), order.getId(), order.getId(), order.getTotalAmount()
        );
        notificationService.sendEmailNotification(order.getEmail(), "BookStore - Đơn hàng giao thành công", emailContent);
    }

    private void triggerPaymentSuccessNotification(Order order) {
        String title = "Đơn hàng #" + order.getId() + " thanh toán thành công";
        String message = String.format("Đơn hàng #%d của bạn đã được thanh toán thành công.", order.getId());

        // In-app notification
        notificationService.createNotification(order.getUser(), title, message);

        // Email notification
        String emailContent = String.format(
                "Xin chào %s,\n\n" +
                "Chúng tôi đã xác nhận thanh toán thành công cho đơn hàng #%d của bạn.\n\n" +
                "Thông tin thanh toán:\n" +
                "- Phương thức: %s\n" +
                "- Tổng số tiền: %,.0f VNĐ\n\n" +
                "Trân trọng,\nBookStore Team.",
                order.getFullName(), order.getId(), order.getPaymentMethod(), order.getTotalAmount()
        );
        notificationService.sendEmailNotification(order.getEmail(), "BookStore - Xác nhận thanh toán thành công", emailContent);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(
                org.springframework.data.domain.Sort.by("createdAt").descending());
    }

    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }
}
