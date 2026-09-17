package com.smartinventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_address")
    private String customerAddress;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(defaultValue = "0.00")
    private BigDecimal discount;

    @Column(defaultValue = "0.00")
    private BigDecimal tax;

    @Column(name = "grand_total", nullable = false)
    private BigDecimal grandTotal;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod; // CASH, CARD, UPI, NET_BANKING

    @Column(name = "amount_paid")
    private BigDecimal amountPaid;

    @Column(name = "change_amount")
    private BigDecimal changeAmount;

    @Column(nullable = false)
    private String status; // COMPLETED, CANCELLED

    @Column(name = "sale_timestamp")
    private LocalDateTime saleTimestamp;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SaleItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.saleTimestamp == null) {
            this.saleTimestamp = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "COMPLETED";
        }
    }
}
