package com.smartinventory.repository;

import com.smartinventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductId(Long productId);
    List<StockMovement> findByShopId(Long shopId);
    List<StockMovement> findByMovementType(String movementType);
    List<StockMovement> findAllByOrderByCreatedAtDesc();
}
