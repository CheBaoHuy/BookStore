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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {
    private static final int OTP_EXPIRY_MINUTES = 10;


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

    @Autowired
    private NotificationService notificationService;

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
        notifyAdminsAboutNewUser(user, false);
        sendWelcomeNotificationToUser(user);

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

        if (mailSender == null) {
            throw new RuntimeException("Chức năng gửi email chưa được cấu hình. Vui lòng kiểm tra Gmail SMTP.");
        }

        String otp = generateOtp();
        user.setResetPasswordOtp(passwordEncoder.encode(otp));
        user.setResetPasswordOtpExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        user.setResetPasswordVerifiedAt(null);
        userRepository.save(user);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("BookStore - Mã OTP đặt lại mật khẩu");
            message.setText(String.format(
                    "Xin chào %s,\n\nMã OTP để đặt lại mật khẩu của bạn là: %s\n" +
                            "Mã có hiệu lực trong %d phút.\n\n" +
                            "Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email này.\n\nTrân trọng,\nBookStore",
                    user.getFullName() != null ? user.getFullName() : user.getUsername(),
                    otp,
                    OTP_EXPIRY_MINUTES
            ));
            mailSender.send(message);
        } catch (Exception e) {
            clearResetPasswordState(user);
            userRepository.save(user);
            throw new RuntimeException("Không thể gửi OTP đến email của bạn. Vui lòng kiểm tra cấu hình Gmail SMTP.");
        }

        return "Mã OTP đã được gửi đến email của bạn.";
    }

    public String verifyForgotPasswordOtp(VerifyOtpDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy email trong hệ thống!"));

        validateOtp(user, dto.getOtp());
        user.setResetPasswordVerifiedAt(LocalDateTime.now());
        userRepository.save(user);

        return "Xác minh OTP thành công.";
    }

    public String resetPasswordWithOtp(ResetPasswordDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy email trong hệ thống!"));

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Xác nhận mật khẩu không khớp.");
        }

        validateOtp(user, dto.getOtp());

        if (user.getResetPasswordVerifiedAt() == null) {
            throw new RuntimeException("Vui lòng xác minh OTP trước khi đặt lại mật khẩu.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        clearResetPasswordState(user);
        userRepository.save(user);

        return "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.";
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
            notifyAdminsAboutNewUser(user, true);
            sendWelcomeNotificationToUser(user);
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

    private void validateOtp(User user, String otp) {
        if (user.getResetPasswordOtp() == null || user.getResetPasswordOtpExpiresAt() == null) {
            throw new RuntimeException("OTP không tồn tại hoặc đã được sử dụng. Vui lòng yêu cầu mã mới.");
        }

        if (user.getResetPasswordOtpExpiresAt().isBefore(LocalDateTime.now())) {
            clearResetPasswordState(user);
            userRepository.save(user);
            throw new RuntimeException("OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        if (!passwordEncoder.matches(otp, user.getResetPasswordOtp())) {
            throw new RuntimeException("OTP không chính xác.");
        }
    }

    private void clearResetPasswordState(User user) {
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpiresAt(null);
        user.setResetPasswordVerifiedAt(null);
    }

    private String generateOtp() {
        int otp = 100000 + new Random().nextInt(900000);
        return String.valueOf(otp);
    }

    private void notifyAdminsAboutNewUser(User user, boolean isGoogleRegistration) {
        List<User> admins = userRepository.findByRole("ADMIN");
        if (admins.isEmpty()) {
            return;
        }

        String displayName = user.getFullName() != null && !user.getFullName().isBlank()
                ? user.getFullName()
                : user.getUsername();
        String registerSource = isGoogleRegistration ? "qua Google" : "thành công";
        String title = "Khách hàng đăng ký tài khoản mới";
        String message = displayName + " vừa đăng ký tài khoản "
                + registerSource + " với email " + user.getEmail() + ".";
        String targetUrl = "/admin?tab=users";

        admins.forEach(admin -> notificationService.createNotification(admin, title, message, targetUrl));
    }

    private void sendWelcomeNotificationToUser(User user) {
        String displayName = user.getFullName() != null && !user.getFullName().isBlank()
                ? user.getFullName()
                : user.getUsername();
        String title = "Chào mừng bạn đến với BookStore! 🎉";
        String message = "Xin chào " + displayName + "! Tài khoản của bạn đã được tạo thành công. "
                + "Khám phá hàng ngàn đầu sách hấp dẫn và trải nghiệm mua sắm tuyệt vời tại BookStore nhé!";
        String targetUrl = "/profile";
        notificationService.createNotification(user, title, message, targetUrl);
    }
}
