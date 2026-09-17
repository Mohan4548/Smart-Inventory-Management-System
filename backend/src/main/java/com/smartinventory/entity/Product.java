package com.smartinventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @NotBlank(message = "Product ID is required")
    @Column(name = "product_id", unique = true, nullable = false)
    private String productId;

    @NotBlank(message = "Product name is required")
    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_image")
    private String productImage;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @Column(name = "sub_category")
    private String subCategory;

    @NotBlank(message = "Brand / Company is required")
    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "model_number")
    private String modelNumber;

    @Column(unique = true)
    private String sku;

    @NotBlank(message = "Barcode is required")
    @Column(unique = true, nullable = false)
    private String barcode;

    @Column(length = 1000)
    private String description;

    @NotNull(message = "Purchase price is required")
    @Min(value = 0, message = "Purchase price cannot be negative")
    @Column(name = "purchase_price", nullable = false)
    private BigDecimal purchasePrice;

    @NotNull(message = "Selling price is required")
    @Min(value = 0, message = "Selling price cannot be negative")
    @Column(name = "selling_price", nullable = false)
    private BigDecimal sellingPrice;

    private BigDecimal tax;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Minimum stock level is required")
    @Min(value = 0, message = "Minimum stock level cannot be negative")
    @Column(name = "minimum_stock_level", nullable = false)
    private Integer minimumStockLevel;

    @Column(name = "maximum_stock_level")
    private Integer maximumStockLevel;

    private String unit;

    @Column(name = "batch_number")
    private String batchNumber;

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    // Database JPA Relationships
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(name = "rack_number")
    private String rackNumber;

    @Column(name = "shelf_number")
    private String shelfNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Dynamic stock status calculation
    public String getCalculatedStockStatus() {
        if (quantity == null || quantity <= 0) {
            return "OUT OF STOCK";
        }
        int minLevel = (minimumStockLevel != null) ? minimumStockLevel : 5;
        if (quantity <= minLevel) {
            return "LOW STOCK";
        }
        return "IN STOCK";
    }
}
