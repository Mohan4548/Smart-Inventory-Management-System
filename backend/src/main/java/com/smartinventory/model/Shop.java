package com.smartinventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "shops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Shop name is required")
    private String name;

    @NotBlank(message = "Branch name is required")
    private String branchName;

    private String address;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private String contactNumber;
    private String managerName;
}
