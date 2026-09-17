package com.smartinventory.controller;

import com.smartinventory.dto.request.ProductRequestDto;
import com.smartinventory.dto.response.ApiResponseDto;
import com.smartinventory.dto.response.ProductResponseDto;
import com.smartinventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<ProductResponseDto>>> getAllProducts(
            @RequestParam(required = false) Long shopId,
            @RequestParam(required = false) String query) {
        List<ProductResponseDto> products = productService.getAllProducts(shopId, query);
        return ResponseEntity.ok(ApiResponseDto.ok("Products retrieved successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> getProductById(@PathVariable Long id) {
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponseDto.ok("Product details retrieved", product));
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> getProductByBarcode(@PathVariable String barcode) {
        ProductResponseDto product = productService.getProductByBarcode(barcode);
        return ResponseEntity.ok(ApiResponseDto.ok("Product retrieved by barcode", product));
    }

    @GetMapping("/code/{productId}")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> getProductByProductId(@PathVariable String productId) {
        ProductResponseDto product = productService.getProductByProductId(productId);
        return ResponseEntity.ok(ApiResponseDto.ok("Product retrieved by Product ID", product));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> createProduct(@Valid @RequestBody ProductRequestDto requestDto) {
        ProductResponseDto created = productService.createProduct(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.ok("Product created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody ProductRequestDto requestDto) {
        ProductResponseDto updated = productService.updateProduct(id, requestDto);
        return ResponseEntity.ok(ApiResponseDto.ok("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponseDto.ok("Product deleted successfully", null));
    }
}
