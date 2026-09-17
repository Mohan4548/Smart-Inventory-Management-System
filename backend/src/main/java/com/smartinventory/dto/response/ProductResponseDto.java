package com.smartinventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDto {
    private Long id;
    private String productId;
    private String productName;
    private String productImage;
    private String category;
    private String subCategory;
    private String brandName;
    private String modelNumber;
    private String sku;
    private String barcode;
    private String description;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private BigDecimal tax;
    private Integer quantity;
    private Integer minimumStockLevel;
    private Integer maximumStockLevel;
    private String unit;
    private String batchNumber;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;

    // Supplier Info
    private Long supplierId;
    private String supplierName;
    private String supplierContact;
    private String supplierEmail;
    private String supplierAddress;

    // Shop / Location Info
    private Long shopId;
    private String shopName;
    private String branchName;
    private String shopCity;
    private String shopAddress;
    private String rackNumber;
    private String shelfNumber;

    // Calculated Stock Status: IN STOCK / LOW STOCK / OUT OF STOCK
    private String stockStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
