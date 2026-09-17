package com.smartinventory.service;

import com.smartinventory.dto.request.ProductRequestDto;
import com.smartinventory.dto.response.ProductResponseDto;
import com.smartinventory.entity.Product;
import com.smartinventory.entity.Shop;
import com.smartinventory.entity.Supplier;
import com.smartinventory.exception.DuplicateResourceException;
import com.smartinventory.exception.InvalidInputException;
import com.smartinventory.exception.ResourceNotFoundException;
import com.smartinventory.repository.ProductRepository;
import com.smartinventory.repository.ShopRepository;
import com.smartinventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ShopRepository shopRepository;

    public List<ProductResponseDto> getAllProducts(Long shopId, String query) {
        List<Product> products;
        if (query != null && !query.trim().isEmpty()) {
            products = productRepository.searchProducts(query.trim());
        } else if (shopId != null) {
            products = productRepository.findByShopId(shopId);
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return mapToResponseDto(product);
    }

    public ProductResponseDto getProductByBarcode(String barcode) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));
        return mapToResponseDto(product);
    }

    public ProductResponseDto getProductByProductId(String productId) {
        Product product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with Product ID: " + productId));
        return mapToResponseDto(product);
    }

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto requestDto) {
        validateUniqueFields(requestDto.getProductId(), requestDto.getBarcode(), requestDto.getSku(), null);
        validateProductRules(requestDto);

        Supplier supplier = supplierRepository.findById(requestDto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + requestDto.getSupplierId()));

        Shop shop = shopRepository.findById(requestDto.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + requestDto.getShopId()));

        Product product = Product.builder()
                .productId(requestDto.getProductId())
                .productName(requestDto.getProductName())
                .productImage(requestDto.getProductImage())
                .category(requestDto.getCategory())
                .subCategory(requestDto.getSubCategory())
                .brandName(requestDto.getBrandName())
                .modelNumber(requestDto.getModelNumber())
                .sku(requestDto.getSku())
                .barcode(requestDto.getBarcode())
                .description(requestDto.getDescription())
                .purchasePrice(requestDto.getPurchasePrice())
                .sellingPrice(requestDto.getSellingPrice())
                .tax(requestDto.getTax())
                .quantity(requestDto.getQuantity())
                .minimumStockLevel(requestDto.getMinimumStockLevel())
                .maximumStockLevel(requestDto.getMaximumStockLevel())
                .unit(requestDto.getUnit())
                .batchNumber(requestDto.getBatchNumber())
                .manufacturingDate(requestDto.getManufacturingDate())
                .expiryDate(requestDto.getExpiryDate())
                .supplier(supplier)
                .shop(shop)
                .rackNumber(requestDto.getRackNumber())
                .shelfNumber(requestDto.getShelfNumber())
                .build();

        Product saved = productRepository.save(product);
        return mapToResponseDto(saved);
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        validateUniqueFields(requestDto.getProductId(), requestDto.getBarcode(), requestDto.getSku(), id);
        validateProductRules(requestDto);

        Supplier supplier = supplierRepository.findById(requestDto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + requestDto.getSupplierId()));

        Shop shop = shopRepository.findById(requestDto.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + requestDto.getShopId()));

        existingProduct.setProductId(requestDto.getProductId());
        existingProduct.setProductName(requestDto.getProductName());
        existingProduct.setProductImage(requestDto.getProductImage());
        existingProduct.setCategory(requestDto.getCategory());
        existingProduct.setSubCategory(requestDto.getSubCategory());
        existingProduct.setBrandName(requestDto.getBrandName());
        existingProduct.setModelNumber(requestDto.getModelNumber());
        existingProduct.setSku(requestDto.getSku());
        existingProduct.setBarcode(requestDto.getBarcode());
        existingProduct.setDescription(requestDto.getDescription());
        existingProduct.setPurchasePrice(requestDto.getPurchasePrice());
        existingProduct.setSellingPrice(requestDto.getSellingPrice());
        existingProduct.setTax(requestDto.getTax());
        existingProduct.setQuantity(requestDto.getQuantity());
        existingProduct.setMinimumStockLevel(requestDto.getMinimumStockLevel());
        existingProduct.setMaximumStockLevel(requestDto.getMaximumStockLevel());
        existingProduct.setUnit(requestDto.getUnit());
        existingProduct.setBatchNumber(requestDto.getBatchNumber());
        existingProduct.setManufacturingDate(requestDto.getManufacturingDate());
        existingProduct.setExpiryDate(requestDto.getExpiryDate());
        existingProduct.setSupplier(supplier);
        existingProduct.setShop(shop);
        existingProduct.setRackNumber(requestDto.getRackNumber());
        existingProduct.setShelfNumber(requestDto.getShelfNumber());

        Product updated = productRepository.save(existingProduct);
        return mapToResponseDto(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }

    private void validateUniqueFields(String productId, String barcode, String sku, Long currentId) {
        productRepository.findByProductId(productId).ifPresent(p -> {
            if (currentId == null || !p.getId().equals(currentId)) {
                throw new DuplicateResourceException("Product ID '" + productId + "' already exists.");
            }
        });

        productRepository.findByBarcode(barcode).ifPresent(p -> {
            if (currentId == null || !p.getId().equals(currentId)) {
                throw new DuplicateResourceException("Barcode '" + barcode + "' already exists. Please use a different barcode.");
            }
        });

        if (sku != null && !sku.trim().isEmpty()) {
            productRepository.findBySku(sku).ifPresent(p -> {
                if (currentId == null || !p.getId().equals(currentId)) {
                    throw new DuplicateResourceException("SKU '" + sku + "' already exists.");
                }
            });
        }
    }

    private void validateProductRules(ProductRequestDto dto) {
        if (dto.getMaximumStockLevel() != null && dto.getMinimumStockLevel() != null) {
            if (dto.getMaximumStockLevel() < dto.getMinimumStockLevel()) {
                throw new InvalidInputException("Maximum stock level cannot be less than minimum stock level.");
            }
        }

        if (dto.getManufacturingDate() != null && dto.getExpiryDate() != null) {
            if (dto.getExpiryDate().isBefore(dto.getManufacturingDate())) {
                throw new InvalidInputException("Expiry date cannot be before manufacturing date.");
            }
        }
    }

    public ProductResponseDto mapToResponseDto(Product p) {
        return ProductResponseDto.builder()
                .id(p.getId())
                .productId(p.getProductId())
                .productName(p.getProductName())
                .productImage(p.getProductImage())
                .category(p.getCategory())
                .subCategory(p.getSubCategory())
                .brandName(p.getBrandName())
                .modelNumber(p.getModelNumber())
                .sku(p.getSku())
                .barcode(p.getBarcode())
                .description(p.getDescription())
                .purchasePrice(p.getPurchasePrice())
                .sellingPrice(p.getSellingPrice())
                .tax(p.getTax())
                .quantity(p.getQuantity())
                .minimumStockLevel(p.getMinimumStockLevel())
                .maximumStockLevel(p.getMaximumStockLevel())
                .unit(p.getUnit())
                .batchNumber(p.getBatchNumber())
                .manufacturingDate(p.getManufacturingDate())
                .expiryDate(p.getExpiryDate())
                .supplierId(p.getSupplier() != null ? p.getSupplier().getId() : null)
                .supplierName(p.getSupplier() != null ? p.getSupplier().getSupplierName() : null)
                .supplierContact(p.getSupplier() != null ? p.getSupplier().getContactNumber() : null)
                .supplierEmail(p.getSupplier() != null ? p.getSupplier().getEmail() : null)
                .supplierAddress(p.getSupplier() != null ? p.getSupplier().getAddress() : null)
                .shopId(p.getShop() != null ? p.getShop().getId() : null)
                .shopName(p.getShop() != null ? p.getShop().getShopName() : null)
                .branchName(p.getShop() != null ? p.getShop().getBranchName() : null)
                .shopCity(p.getShop() != null ? p.getShop().getCity() : null)
                .shopAddress(p.getShop() != null ? p.getShop().getAddress() : null)
                .rackNumber(p.getRackNumber())
                .shelfNumber(p.getShelfNumber())
                .stockStatus(p.getCalculatedStockStatus())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
