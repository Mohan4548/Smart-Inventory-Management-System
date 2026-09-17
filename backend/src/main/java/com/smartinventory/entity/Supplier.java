package com.smartinventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Supplier ID is required")
    @Column(unique = true, nullable = false)
    private String supplierId;

    @NotBlank(message = "Supplier name is required")
    @Column(nullable = false)
    private String supplierName;

    @NotBlank(message = "Contact number is required")
    @Column(nullable = false)
    private String contactNumber;

    @Email
    private String email;

    private String address;
    private String city;
    private String state;
    private String pincode;
    private String gstNumber;

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
}
