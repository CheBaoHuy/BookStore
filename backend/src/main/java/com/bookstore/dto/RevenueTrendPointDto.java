package com.bookstore.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RevenueTrendPointDto(
        LocalDate date,
        BigDecimal revenue
) {
}
