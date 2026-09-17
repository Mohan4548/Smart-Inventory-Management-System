package com.smartinventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShopRequestDto {
    @NotBlank(message = "Shop ID is required")
    private String shopId;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    @NotBlank(message = "Branch name is required")
    private String branchName;

    private String address;
    private String city;
    private String district;
    private String state;
    private String pincode;
}
