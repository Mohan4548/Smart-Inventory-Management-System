package com.smartinventory.controller;

import com.smartinventory.dto.response.ApiResponseDto;
import com.smartinventory.entity.Product;
import com.smartinventory.entity.Sale;
import com.smartinventory.repository.ProductRepository;
import com.smartinventory.repository.SaleRepository;
import com.smartinventory.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ShopRepository shopRepository;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getDashboardSummary(@RequestParam(required = false) Long shopId) {
        List<Product> products = (shopId != null && shopId > 0) 
                ? productRepository.findByShopId(shopId) 
                : productRepository.findAll();

        int totalProducts = products.size();
        int totalStockQuantity = products.stream().mapToInt(Product::getQuantity).sum();

        long lowStockCount = products.stream()
                .filter(p -> p.getQuantity() > 0 && p.getQuantity() <= (p.getMinimumStockLevel() != null ? p.getMinimumStockLevel() : 5))
                .count();

        long outOfStockCount = products.stream()
                .filter(p -> p.getQuantity() == 0)
                .count();

        BigDecimal totalInventoryValue = products.stream()
                .map(p -> p.getPurchasePrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Sales for today
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        List<Sale> todaySales = saleRepository.findTodayCompletedSales(startOfDay, endOfDay);

        if (shopId != null && shopId > 0) {
            todaySales = todaySales.stream().filter(s -> s.getShop().getId().equals(shopId)).toList();
        }

        BigDecimal todaySalesTotal = todaySales.stream()
                .map(Sale::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int todayOrdersCount = todaySales.size();
        long activeShopsCount = shopRepository.count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProducts", totalProducts);
        summary.put("totalStockQuantity", totalStockQuantity);
        summary.put("lowStockCount", lowStockCount);
        summary.put("outOfStockCount", outOfStockCount);
        summary.put("totalInventoryValue", totalInventoryValue);
        summary.put("todaySales", todaySalesTotal);
        summary.put("todayOrders", todayOrdersCount);
        summary.put("activeShops", activeShopsCount);

        return ResponseEntity.ok(ApiResponseDto.ok("Dashboard summary retrieved successfully", summary));
    }
}
