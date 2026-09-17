package com.smartinventory.service;

import com.smartinventory.entity.Product;
import com.smartinventory.entity.Sale;
import com.smartinventory.entity.SaleItem;
import com.smartinventory.entity.Shop;
import com.smartinventory.entity.StockMovement;
import com.smartinventory.exception.InvalidInputException;
import com.smartinventory.exception.ResourceNotFoundException;
import com.smartinventory.repository.ProductRepository;
import com.smartinventory.repository.SaleRepository;
import com.smartinventory.repository.ShopRepository;
import com.smartinventory.repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BillingService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @Transactional(rollbackFor = Exception.class)
    public Sale processBilling(Sale saleRequest) {
        if (saleRequest.getItems() == null || saleRequest.getItems().isEmpty()) {
            throw new InvalidInputException("Billing cart cannot be empty.");
        }

        Shop shop = shopRepository.findById(saleRequest.getShop().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + saleRequest.getShop().getId()));

        // Step 1 & 2: Validate stock for all items before performing mutations
        for (SaleItem item : saleRequest.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + item.getProduct().getId()));

            if (product.getQuantity() < item.getQuantity()) {
                throw new InvalidInputException("Insufficient stock for product '" + product.getProductName() 
                        + "'. Requested: " + item.getQuantity() + ", Available: " + product.getQuantity());
            }
        }

        // Step 3: Set sale parameters & unique invoice number
        if (saleRequest.getInvoiceNumber() == null || saleRequest.getInvoiceNumber().trim().isEmpty()) {
            saleRequest.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
        }
        saleRequest.setShop(shop);
        saleRequest.setSaleTimestamp(LocalDateTime.now());
        saleRequest.setStatus("COMPLETED");

        // Step 4 & 5: Deduct stock, create stock movements, and save items
        for (SaleItem item : saleRequest.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId()).get();
            int previousQty = product.getQuantity();
            int newQty = previousQty - item.getQuantity();

            product.setQuantity(newQty);
            productRepository.save(product);

            // Item relationship set
            item.setSale(saleRequest);
            item.setProduct(product);
            item.setProductName(product.getProductName());
            item.setCustomProductId(product.getProductId());
            item.setBarcode(product.getBarcode());

            // Log Stock Movement Audit
            StockMovement movement = StockMovement.builder()
                    .movementId("MOV-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4))
                    .product(product)
                    .shop(shop)
                    .movementType("SALE")
                    .quantity(item.getQuantity())
                    .previousQuantity(previousQty)
                    .newQuantity(newQty)
                    .reason("POS Sale Transaction (" + saleRequest.getInvoiceNumber() + ")")
                    .referenceNumber(saleRequest.getInvoiceNumber())
                    .build();

            stockMovementRepository.save(movement);
        }

        return saleRepository.save(saleRequest);
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAllByOrderBySaleTimestampDesc();
    }

    public Sale getSaleByInvoice(String invoiceNumber) {
        return saleRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with invoice: " + invoiceNumber));
    }
}
