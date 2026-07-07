package com.bookstore.dto;

public record ReviewEligibilityDto(
        Long orderDetailId,
        Long orderId,
        Long productId,
        String productTitle,
        String productImage,
        int quantity,
        boolean reviewed
) {
}
