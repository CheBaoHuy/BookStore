package com.bookstore.service;

import com.bookstore.dto.*;
import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import com.bookstore.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public AuthResponse register(RegisterDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .fullName(dto.getFullName())
                .role("USER")
                .status(true)
                .build();

        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .build();
    }

    public AuthResponse login(LoginDto dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(dto.getUsername(), dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .build();
    }

    public String forgotPassword(ForgotPasswordDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy email trong hệ thống!"));

        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getEmail());
                message.setSubject("BookStore - Đặt lại mật khẩu");
                message.setText(String.format(
                        "Xin chào %s,\n\nMật khẩu tạm thời của bạn là: %s\n\n" +
                        "Vui lòng đăng nhập và đổi mật khẩu ngay.\n\nTrân trọng,\nBookStore",
                        user.getFullName() != null ? user.getFullName() : user.getUsername(),
                        tempPassword
                ));
                mailSender.send(message);
            } catch (Exception e) {
                // Log error but don't throw - password already reset
                System.err.println("Không thể gửi email: " + e.getMessage());
            }
        }

        return "Mật khẩu tạm thời đã được gửi đến email của bạn.";
    }

    public User getUserProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
    }

    public User updateProfile(String username, UserDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAvatarLink() != null) user.setAvatar(dto.getAvatarLink());
        return userRepository.save(user);
    }

    public AuthResponse googleLogin(GoogleLoginDto dto) {
        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);
        if (user == null) {
            String emailPrefix = dto.getEmail().split("@")[0];
            String uniqueUsername = emailPrefix;
            int counter = 1;
            while (userRepository.existsByUsername(uniqueUsername)) {
                uniqueUsername = emailPrefix + counter;
                counter++;
            }

            user = User.builder()
                    .username(uniqueUsername)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .email(dto.getEmail())
                    .phone("")
                    .fullName(dto.getFullName() != null ? dto.getFullName() : emailPrefix)
                    .avatar(dto.getAvatar())
                    .role("USER")
                    .status(true)
                    .build();
            userRepository.save(user);
        } else {
            if (dto.getAvatar() != null && !dto.getAvatar().isEmpty()) {
                user.setAvatar(dto.getAvatar());
                userRepository.save(user);
            }
        }

        String token = tokenProvider.generateTokenFromUsername(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .build();
    }
}
