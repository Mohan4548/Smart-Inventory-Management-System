package com.smartinventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopResponseDto {
    private Long id;
    private String shopId;
    private String shopName;
    private String branchName;
    private String address;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
