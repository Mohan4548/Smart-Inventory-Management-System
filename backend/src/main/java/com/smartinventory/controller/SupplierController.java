package com.smartinventory.controller;

import com.smartinventory.dto.request.SupplierRequestDto;
import com.smartinventory.dto.response.ApiResponseDto;
import com.smartinventory.dto.response.SupplierResponseDto;
import com.smartinventory.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<SupplierResponseDto>>> getAllSuppliers() {
        List<SupplierResponseDto> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(ApiResponseDto.ok("Suppliers retrieved successfully", suppliers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<SupplierResponseDto>> getSupplierById(@PathVariable Long id) {
        SupplierResponseDto supplier = supplierService.getSupplierById(id);
        return ResponseEntity.ok(ApiResponseDto.ok("Supplier details retrieved", supplier));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<SupplierResponseDto>> createSupplier(@Valid @RequestBody SupplierRequestDto requestDto) {
        SupplierResponseDto created = supplierService.createSupplier(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.ok("Supplier registered successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto<SupplierResponseDto>> updateSupplier(
            @PathVariable Long id, 
            @Valid @RequestBody SupplierRequestDto requestDto) {
        SupplierResponseDto updated = supplierService.updateSupplier(id, requestDto);
        return ResponseEntity.ok(ApiResponseDto.ok("Supplier updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok(ApiResponseDto.ok("Supplier deleted successfully", null));
    }
}
