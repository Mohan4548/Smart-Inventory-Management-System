package com.smartinventory.service;

import com.smartinventory.dto.request.SupplierRequestDto;
import com.smartinventory.dto.response.SupplierResponseDto;
import com.smartinventory.entity.Supplier;
import com.smartinventory.exception.DuplicateResourceException;
import com.smartinventory.exception.ResourceNotFoundException;
import com.smartinventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<SupplierResponseDto> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public SupplierResponseDto getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));
        return mapToResponseDto(supplier);
    }

    @Transactional
    public SupplierResponseDto createSupplier(SupplierRequestDto requestDto) {
        if (supplierRepository.existsBySupplierId(requestDto.getSupplierId())) {
            throw new DuplicateResourceException("Supplier ID '" + requestDto.getSupplierId() + "' already exists.");
        }

        Supplier supplier = Supplier.builder()
                .supplierId(requestDto.getSupplierId())
                .supplierName(requestDto.getSupplierName())
                .contactNumber(requestDto.getContactNumber())
                .email(requestDto.getEmail())
                .address(requestDto.getAddress())
                .city(requestDto.getCity())
                .state(requestDto.getState())
                .pincode(requestDto.getPincode())
                .gstNumber(requestDto.getGstNumber())
                .build();

        Supplier saved = supplierRepository.save(supplier);
        return mapToResponseDto(saved);
    }

    @Transactional
    public SupplierResponseDto updateSupplier(Long id, SupplierRequestDto requestDto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));

        if (!supplier.getSupplierId().equals(requestDto.getSupplierId()) && supplierRepository.existsBySupplierId(requestDto.getSupplierId())) {
            throw new DuplicateResourceException("Supplier ID '" + requestDto.getSupplierId() + "' already exists.");
        }

        supplier.setSupplierId(requestDto.getSupplierId());
        supplier.setSupplierName(requestDto.getSupplierName());
        supplier.setContactNumber(requestDto.getContactNumber());
        supplier.setEmail(requestDto.getEmail());
        supplier.setAddress(requestDto.getAddress());
        supplier.setCity(requestDto.getCity());
        supplier.setState(requestDto.getState());
        supplier.setPincode(requestDto.getPincode());
        supplier.setGstNumber(requestDto.getGstNumber());

        Supplier updated = supplierRepository.save(supplier);
        return mapToResponseDto(updated);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Supplier not found with ID: " + id);
        }
        supplierRepository.deleteById(id);
    }

    public SupplierResponseDto mapToResponseDto(Supplier supplier) {
        return SupplierResponseDto.builder()
                .id(supplier.getId())
                .supplierId(supplier.getSupplierId())
                .supplierName(supplier.getSupplierName())
                .contactNumber(supplier.getContactNumber())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .city(supplier.getCity())
                .state(supplier.getState())
                .pincode(supplier.getPincode())
                .gstNumber(supplier.getGstNumber())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }
}
