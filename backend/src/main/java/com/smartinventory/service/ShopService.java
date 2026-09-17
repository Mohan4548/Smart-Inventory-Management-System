package com.smartinventory.service;

import com.smartinventory.dto.request.ShopRequestDto;
import com.smartinventory.dto.response.ShopResponseDto;
import com.smartinventory.entity.Shop;
import com.smartinventory.exception.DuplicateResourceException;
import com.smartinventory.exception.ResourceNotFoundException;
import com.smartinventory.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    public List<ShopResponseDto> getAllShops() {
        return shopRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ShopResponseDto getShopById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + id));
        return mapToResponseDto(shop);
    }

    @Transactional
    public ShopResponseDto createShop(ShopRequestDto requestDto) {
        if (shopRepository.existsByShopId(requestDto.getShopId())) {
            throw new DuplicateResourceException("Shop ID '" + requestDto.getShopId() + "' already exists.");
        }

        Shop shop = Shop.builder()
                .shopId(requestDto.getShopId())
                .shopName(requestDto.getShopName())
                .branchName(requestDto.getBranchName())
                .address(requestDto.getAddress())
                .city(requestDto.getCity())
                .district(requestDto.getDistrict())
                .state(requestDto.getState())
                .pincode(requestDto.getPincode())
                .build();

        Shop saved = shopRepository.save(shop);
        return mapToResponseDto(saved);
    }

    @Transactional
    public ShopResponseDto updateShop(Long id, ShopRequestDto requestDto) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + id));

        if (!shop.getShopId().equals(requestDto.getShopId()) && shopRepository.existsByShopId(requestDto.getShopId())) {
            throw new DuplicateResourceException("Shop ID '" + requestDto.getShopId() + "' already exists.");
        }

        shop.setShopId(requestDto.getShopId());
        shop.setShopName(requestDto.getShopName());
        shop.setBranchName(requestDto.getBranchName());
        shop.setAddress(requestDto.getAddress());
        shop.setCity(requestDto.getCity());
        shop.setDistrict(requestDto.getDistrict());
        shop.setState(requestDto.getState());
        shop.setPincode(requestDto.getPincode());

        Shop updated = shopRepository.save(shop);
        return mapToResponseDto(updated);
    }

    @Transactional
    public void deleteShop(Long id) {
        if (!shopRepository.existsById(id)) {
            throw new ResourceNotFoundException("Shop not found with ID: " + id);
        }
        shopRepository.deleteById(id);
    }

    public ShopResponseDto mapToResponseDto(Shop shop) {
        return ShopResponseDto.builder()
                .id(shop.getId())
                .shopId(shop.getShopId())
                .shopName(shop.getShopName())
                .branchName(shop.getBranchName())
                .address(shop.getAddress())
                .city(shop.getCity())
                .district(shop.getDistrict())
                .state(shop.getState())
                .pincode(shop.getPincode())
                .createdAt(shop.getCreatedAt())
                .updatedAt(shop.getUpdatedAt())
                .build();
    }
}
