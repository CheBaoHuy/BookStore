package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderDto {

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    private String note;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;

    private boolean paymentStatus;

    @NotNull(message = "Phí vận chuyển không được để trống")
    private BigDecimal shippingCost;

    @NotNull(message = "Tổng tiền không được để trống")
    private BigDecimal totalAmount;

    @NotNull(message = "Sản phẩm không được để trống")
    private List<OrderItemDto> orderItems;

    @Data
    public static class OrderItemDto {
        private Long productId;
        private int quantity;
        private BigDecimal price;
    }
}
