package com.bookstore.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(length = 500)
    private String avatar;

    @Column(nullable = false)
    @Builder.Default
    private boolean status = true;

    @Column(length = 20)
    @Builder.Default
    private String role = "USER";

    @Column(name = "reset_password_otp", length = 255)
    private String resetPasswordOtp;

    @Column(name = "reset_password_otp_expires_at")
    private LocalDateTime resetPasswordOtpExpiresAt;

    @Column(name = "reset_password_verified_at")
    private LocalDateTime resetPasswordVerifiedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
