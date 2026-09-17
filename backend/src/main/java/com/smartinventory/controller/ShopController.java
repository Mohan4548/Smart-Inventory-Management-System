package com.smartinventory.controller;

import com.smartinventory.dto.request.ShopRequestDto;
import com.smartinventory.dto.response.ApiResponseDto;
import com.smartinventory.dto.response.ShopResponseDto;
import com.smartinventory.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin(origins = "*")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<ShopResponseDto>>> getAllShops() {
        List<ShopResponseDto> shops = shopService.getAllShops();
        return ResponseEntity.ok(ApiResponseDto.ok("Shops retrieved successfully", shops));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<ShopResponseDto>> getShopById(@PathVariable Long id) {
        ShopResponseDto shop = shopService.getShopById(id);
        return ResponseEntity.ok(ApiResponseDto.ok("Shop details retrieved", shop));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<ShopResponseDto>> createShop(@Valid @RequestBody ShopRequestDto requestDto) {
        ShopResponseDto created = shopService.createShop(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.ok("Shop created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto<ShopResponseDto>> updateShop(
            @PathVariable Long id, 
            @Valid @RequestBody ShopRequestDto requestDto) {
        ShopResponseDto updated = shopService.updateShop(id, requestDto);
        return ResponseEntity.ok(ApiResponseDto.ok("Shop updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
        return ResponseEntity.ok(ApiResponseDto.ok("Shop deleted successfully", null));
    }
}
