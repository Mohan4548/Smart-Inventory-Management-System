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
public class SupplierResponseDto {
    private Long id;
    private String supplierId;
    private String supplierName;
    private String contactNumber;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String gstNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
