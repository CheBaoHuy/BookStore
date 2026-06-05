package com.bookstore.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RateDto {

    @NotNull(message = "userId không được để trống")
    private Long userId;

    @NotNull(message = "productId không được để trống")
    private Long productId;

    private String content;

    @NotNull(message = "Số sao không được để trống")
    @Min(value = 1, message = "Số sao tối thiểu là 1")
    @Max(value = 5, message = "Số sao tối đa là 5")
    private Integer stars;

    private Long orderDetailsId;
}
