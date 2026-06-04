package com.bookstore.controller;

import com.bookstore.dto.AddressDto;
import com.bookstore.model.Address;
import com.bookstore.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    /** GET /api/addresses/user/{userId} */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddressesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUser(userId));
    }

    /** POST /api/addresses?userId={userId} */
    @PostMapping
    public ResponseEntity<?> createAddress(
            @RequestParam Long userId,
            @RequestBody AddressDto dto) {
        try {
            Address address = addressService.createAddress(userId, dto);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** PUT /api/addresses/{id}?userId={userId} */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody AddressDto dto) {
        try {
            Address address = addressService.updateAddress(id, userId, dto);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** DELETE /api/addresses/{id}?userId={userId} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            addressService.deleteAddress(id, userId);
            return ResponseEntity.ok(Map.of("message", "Xóa địa chỉ thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
