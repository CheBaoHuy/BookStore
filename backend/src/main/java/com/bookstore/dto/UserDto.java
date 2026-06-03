package com.bookstore.dto;

import lombok.Data;

@Data
public class UserDto {
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String avatarLink;
}
