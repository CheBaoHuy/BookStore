package com.bookstore.dto;

import java.time.LocalDateTime;

public record ReviewSummaryDto(
        Long id,
        Long orderId,
        Long orderDetailId,
        Long productId,
        String productTitle,
        String productImage,
        Long userId,
        String username,
        String fullName,
        int rating,
        String comment,
        String adminReply,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime adminRepliedAt,
        String adminRepliedBy,
        boolean status
) {
}
