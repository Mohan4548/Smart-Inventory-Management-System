package com.smartinventory.repository;

import com.smartinventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByBarcode(String barcode);

    Optional<Product> findByProductId(String productId);

    Optional<Product> findBySku(String sku);

    boolean existsByBarcode(String barcode);

    boolean existsByProductId(String productId);

    boolean existsBySku(String sku);

    List<Product> findByShopId(Long shopId);

    List<Product> findByCategory(String category);

    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.productId) LIKE LOWER(CONCAT('%', :query, '%')) OR p.barcode LIKE CONCAT('%', :query, '%')")
    List<Product> searchProducts(String query);
}
