package com.smartinventory.controller;

import com.smartinventory.model.Sale;
import com.smartinventory.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @PostMapping("/process")
    public ResponseEntity<?> processBilling(@Valid @RequestBody Sale saleRequest) {
        try {
            Sale processedSale = billingService.processBilling(saleRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(processedSale);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to process billing: " + e.getMessage());
        }
    }
}
