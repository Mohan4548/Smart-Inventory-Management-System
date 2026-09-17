package com.smartinventory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductRequestDto {
    @NotBlank(message = "Product ID is required")
    private String productId;

    @NotBlank(message = "Product name is required")
    private String productName;

    private String productImage;

    @NotBlank(message = "Category is required")
    private String category;

    private String subCategory;

    @NotBlank(message = "Brand / Company is required")
    private String brandName;

    private String modelNumber;
    private String sku;

    @NotBlank(message = "Barcode is required")
    private String barcode;

    private String description;

    @NotNull(message = "Purchase price is required")
    @Min(value = 0, message = "Purchase price cannot be negative")
    private BigDecimal purchasePrice;

    @NotNull(message = "Selling price is required")
    @Min(value = 0, message = "Selling price cannot be negative")
    private BigDecimal sellingPrice;

    private BigDecimal tax; // GST %

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum stock level is required")
    @Min(value = 0, message = "Minimum stock level cannot be negative")
    private Integer minimumStockLevel;

    private Integer maximumStockLevel;
    private String unit;
    private String batchNumber;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Shop ID is required")
    private Long shopId;

    private String rackNumber;
    private String shelfNumber;
}
