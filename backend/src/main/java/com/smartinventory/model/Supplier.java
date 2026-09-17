package com.smartinventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

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

    @NotBlank(message = "Supplier name is required")
    private String name;

    private String companyName;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @Email(message = "Valid email is required")
    private String email;

    private String address;
    private String city;
    private String state;
    private String gstNumber;
}
