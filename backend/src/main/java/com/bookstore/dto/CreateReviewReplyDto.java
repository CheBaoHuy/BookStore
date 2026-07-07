package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateReviewReplyDto(
        @NotBlank(message = "Nội dung phản hồi không được để trống")
        @Size(max = 2000, message = "Nội dung phản hồi không được vượt quá 2000 ký tự")
        String message
) {
}
