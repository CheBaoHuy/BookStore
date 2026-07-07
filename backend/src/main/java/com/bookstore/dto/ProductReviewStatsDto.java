package com.bookstore.dto;

public record ProductReviewStatsDto(
        double averageRating,
        long totalReviews
) {
}
