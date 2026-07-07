package com.bookstore.dto;

public record ReviewAdminSummaryDto(
        long totalReviews,
        long pendingReplies,
        long repliedReviews,
        double averageRating
) {
}
