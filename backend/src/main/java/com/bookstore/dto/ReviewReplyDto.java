package com.bookstore.dto;

import java.time.LocalDateTime;

public record ReviewReplyDto(
        Long id,
        Long userId,
        String authorName,
        String authorRole,
        String message,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
