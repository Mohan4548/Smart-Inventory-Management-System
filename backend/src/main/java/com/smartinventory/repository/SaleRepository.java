package com.smartinventory.repository;

import com.smartinventory.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findByInvoiceNumber(String invoiceNumber);

    List<Sale> findByShopId(Long shopId);

    @Query("SELECT s FROM Sale s WHERE s.saleTimestamp >= :startOfDay AND s.saleTimestamp <= :endOfDay AND s.status = 'COMPLETED'")
    List<Sale> findTodayCompletedSales(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<Sale> findAllByOrderBySaleTimestampDesc();
}
