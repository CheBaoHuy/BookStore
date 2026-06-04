package com.bookstore.dto;

import lombok.Data;

@Data
public class AddressDto {
    private Long id;
    private String fullName;
    private String phone;
    private String street;
    private Integer wardId;
    private String ward;
    private Integer districtId;
    private String district;
    private Integer provinceId;
    private String province;
    private boolean isDefault;
}
