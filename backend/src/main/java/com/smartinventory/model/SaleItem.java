package com.smartinventory.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sale_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String customProductId;
    private String productName;
    private String barcode;

    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
}
