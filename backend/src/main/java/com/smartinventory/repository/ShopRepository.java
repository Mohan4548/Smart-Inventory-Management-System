package com.smartinventory.repository;

import com.smartinventory.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByShopId(String shopId);
    boolean existsByShopId(String shopId);
}
