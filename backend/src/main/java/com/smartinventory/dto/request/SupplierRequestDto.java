package com.smartinventory.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierRequestDto {
    @NotBlank(message = "Supplier ID is required")
    private String supplierId;

    @NotBlank(message = "Supplier name is required")
    private String supplierName;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @Email(message = "Valid email address is required")
    private String email;

    private String address;
    private String city;
    private String state;
    private String pincode;
    private String gstNumber;
}
