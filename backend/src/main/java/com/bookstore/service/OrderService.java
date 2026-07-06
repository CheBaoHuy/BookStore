package com.bookstore.service;

import com.bookstore.dto.OrderDto;
import com.bookstore.dto.RevenueTrendPointDto;
import com.bookstore.model.*;
import com.bookstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

        // Validate state transitions
        if ((oldStatusId == 4 || oldStatusId == 5) && !oldStatusId.equals(statusId)) {
            throw new RuntimeException("Đơn hàng đã hoàn thành hoặc đã hủy, không thể thay đổi trạng thái!");
        }
        if (statusId < oldStatusId) {
            throw new RuntimeException("Không thể chuyển trạng thái đơn hàng ngược lại!");
        }

        order.setOrderStatus(status);

        // Automatically set paymentStatus = true if order is successfully delivered (statusId = 4)
        if (statusId == 4) {
            order.setPaymentStatus(true);
        }

        Order savedOrder = orderRepository.save(order);

        // Trigger notification for state transition if changed
        if (!oldStatusId.equals(statusId)) {
            triggerOrderStatusNotification(savedOrder, statusId);
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

    private void triggerOrderStatusNotification(Order order, Long statusId) {
        String statusName = order.getOrderStatus() != null ? order.getOrderStatus().getStatus() : "Chờ xác nhận";

        String title;
        String message;
        String emailSubject;
        String emailContent;

        switch (statusId.intValue()) {
            case 2: // Đã xác nhận
                title = "Đơn hàng #" + order.getId() + " đã được xác nhận";
                message = String.format("Đơn hàng #%d của bạn đã được xác nhận thành công và đang được chuẩn bị đóng gói.", order.getId());
                emailSubject = "BookStore - Đơn hàng đã được xác nhận";
                emailContent = String.format(
                        "Xin chào %s,\n\n" +
                        "Đơn hàng #%d của bạn đã được xác nhận thành công.\n" +
                        "Chúng tôi đang tiến hành chuẩn bị sách và đóng gói gửi tới bạn trong thời gian sớm nhất.\n\n" +
                        "Cảm ơn bạn đã mua hàng tại BookStore!\nTrân trọng.",
                        order.getFullName(), order.getId()
                );
                break;
            case 3: // Đang giao hàng
                title = "Đơn hàng #" + order.getId() + " đang được giao";
                message = String.format("Đơn hàng #%d của bạn đang được giao. Người giao hàng sẽ sớm liên hệ với bạn.", order.getId());
                emailSubject = "BookStore - Đơn hàng đang giao";
                emailContent = String.format(
                        "Xin chào %s,\n\n" +
                        "Đơn hàng #%d của bạn đã được chuyển sang trạng thái đang giao hàng và đang trên đường tới địa chỉ của bạn.\n\n" +
                        "Thông tin nhận hàng:\n" +
                        "- Địa chỉ: %s\n" +
                        "- Số điện thoại: %s\n" +
                        "- Tổng thanh toán: %,.0f VNĐ\n\n" +
                        "Cảm ơn bạn đã mua hàng tại BookStore!\nTrân trọng.",
                        order.getFullName(), order.getId(), order.getAddress(), order.getPhone(), order.getTotalAmount()
                );
                break;
            case 4: // Đã giao hàng
                title = "Đơn hàng #" + order.getId() + " giao thành công";
                message = String.format("Đơn hàng #%d của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại BookStore!", order.getId());
                emailSubject = "BookStore - Đơn hàng giao thành công";
                emailContent = String.format(
                        "Xin chào %s,\n\n" +
                        "Đơn hàng #%d của bạn đã được giao thành công.\n\n" +
                        "Thông tin đơn hàng:\n" +
                        "- Mã đơn hàng: #%d\n" +
                        "- Tổng thanh toán: %,.0f VNĐ\n\n" +
                        "Cảm ơn bạn đã tin tưởng và đồng hành cùng BookStore!\nTrân trọng.",
                        order.getFullName(), order.getId(), order.getId(), order.getTotalAmount()
                );
                break;
            case 5: // Đã hủy
                title = "Đơn hàng #" + order.getId() + " đã bị hủy";
                message = String.format("Đơn hàng #%d của bạn đã bị hủy.", order.getId());
                emailSubject = "BookStore - Đơn hàng đã bị hủy";
                emailContent = String.format(
                        "Xin chào %s,\n\n" +
                        "Đơn hàng #%d của bạn đã bị hủy trên hệ thống.\n" +
                        "Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng của BookStore.\n\n" +
                        "Trân trọng.",
                        order.getFullName(), order.getId()
                );
                break;
            default: // Chờ xác nhận (1) hoặc các trạng thái khác
                title = "Đơn hàng #" + order.getId() + " cập nhật trạng thái";
                message = String.format("Đơn hàng #%d của bạn đã được chuyển sang trạng thái: %s.", order.getId(), statusName);
                emailSubject = "BookStore - Cập nhật trạng thái đơn hàng";
                emailContent = String.format(
                        "Xin chào %s,\n\n" +
                        "Đơn hàng #%d của bạn đã được chuyển sang trạng thái mới: %s.\n\n" +
                        "Trân trọng,\nBookStore.",
                        order.getFullName(), order.getId(), statusName
                );
                break;
        }

        // 1. In-app notification
        notificationService.createNotification(order.getUser(), title, message);

        // 2. Email notification
        notificationService.sendEmailNotification(order.getEmail(), emailSubject, emailContent);
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

    public List<RevenueTrendPointDto> getRevenueTrendByDate(LocalDate startDate, LocalDate endDate, Long categoryId) {
        OrderStatus deliveredStatus = orderStatusRepository.findByStatus("Đã giao hàng")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái đơn hàng đã giao!"));

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        List<Order> deliveredOrders = orderRepository.findRevenueOrdersInRange(
                deliveredStatus.getId(),
                startDateTime,
                endDateTime
        );

        Map<LocalDate, BigDecimal> revenueByDate = new LinkedHashMap<>();
        LocalDate cursor = startDate;
        while (!cursor.isAfter(endDate)) {
            revenueByDate.put(cursor, BigDecimal.ZERO);
            cursor = cursor.plusDays(1);
        }

        for (Order order : deliveredOrders) {
            LocalDate orderDate = order.getCreatedAt().toLocalDate();
            BigDecimal orderRevenue = calculateOrderRevenue(order, categoryId);
            revenueByDate.computeIfPresent(orderDate, (date, currentRevenue) -> currentRevenue.add(orderRevenue));
        }

        return revenueByDate.entrySet().stream()
                .map(entry -> new RevenueTrendPointDto(entry.getKey(), entry.getValue()))
                .toList();
    }

    private BigDecimal calculateOrderRevenue(Order order, Long categoryId) {
        if (categoryId == null) {
            return order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
        }

        if (order.getOrderDetails() == null) {
            return BigDecimal.ZERO;
        }

        return order.getOrderDetails().stream()
                .filter(detail -> detail.getProduct() != null
                        && detail.getProduct().getCategory() != null
                        && categoryId.equals(detail.getProduct().getCategory().getId()))
                .map(detail -> {
                    BigDecimal price = detail.getPrice() != null ? detail.getPrice() : BigDecimal.ZERO;
                    BigDecimal quantity = BigDecimal.valueOf(detail.getQuantity());
                    return price.multiply(quantity);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
