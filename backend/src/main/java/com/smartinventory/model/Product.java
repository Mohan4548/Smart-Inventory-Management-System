package com.smartinventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product ID / Code is required")
    @Column(unique = true, nullable = false)
    private String customProductId;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    private String image;

    @NotBlank(message = "Category is required")
    private String category;

    private String subCategory;

    @NotBlank(message = "Brand / Company is required")
    private String brand;

    private String modelNumber;
    private String sku;

    @NotBlank(message = "Barcode is required")
    @Column(unique = true, nullable = false)
    private String barcode;

    @Column(length = 1000)
    private String description;

    // Pricing
    @NotNull(message = "Purchase price is required")
    @Min(value = 0, message = "Purchase price cannot be negative")
    private BigDecimal purchasePrice;

    @NotNull(message = "Selling price is required")
    @Min(value = 0, message = "Selling price cannot be negative")
    private BigDecimal sellingPrice;

    private BigDecimal taxPercentage; // GST %
    private BigDecimal discountPercentage;

    // Inventory
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum stock level is required")
    @Min(value = 0, message = "Minimum stock level cannot be negative")
    private Integer minimumStockLevel;

    private Integer maximumStockLevel;
    private String unit; // e.g. Pcs, Kg, Ltr, Box
    private String batchNumber;
    private LocalDate mfgDate;
    private LocalDate expiryDate;

    // Relationships / Foreign Details
    @NotNull(message = "Supplier is required")
    private Long supplierId;
    private String supplierName;

    @NotNull(message = "Shop location is required")
    private Long shopId;
    private String shopName;
    private String rackNumber;
    private String shelfNumber;

    // Calculated stock status helper
    public String getCalculatedStockStatus() {
        if (quantity == null || quantity <= 0) {
            return "OUT OF STOCK";
        } else if (quantity <= (minimumStockLevel != null ? minimumStockLevel : 5)) {
            return "LOW STOCK";
        } else {
            return "IN STOCK";
        }
    }
}
