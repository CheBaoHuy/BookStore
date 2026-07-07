package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminReplyDto {

    @NotBlank(message = "Nội dung phản hồi không được để trống")
    private String reply;
}
