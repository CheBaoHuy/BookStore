package com.bookstore.dto;

import java.math.BigDecimal;

public record RevenueCategoryShareDto(
        Long categoryId,
        String categoryName,
        BigDecimal revenue
) {
}
