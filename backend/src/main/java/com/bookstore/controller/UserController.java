package com.bookstore.controller;

import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /** GET /api/users
     *  Admin retrieves all users */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /** PUT /api/users/{id}/status
     *  Toggle blocking status (active/blocked) */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id, @RequestParam boolean status) {
        return userRepository.findById(id).map(user -> {
            user.setStatus(status);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    /** PUT /api/users/{id}/role
     *  Change user role (USER / ADMIN) */
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        if (!role.equals("USER") && !role.equals("ADMIN")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role không hợp lệ. Phải là USER hoặc ADMIN."));
        }
        return userRepository.findById(id).map(user -> {
            user.setRole(role);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/users/{id}
     *  Delete user */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công!"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
