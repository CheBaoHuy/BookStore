import React from "react";
import "./Register.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import logo from "../../images/logo_green.png";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from "react-icons/fa";

function Register() {
    return (
        <>
            <Header />
            <div className="register-page">
                <div className="register-card">

                    {/* Logo */}
                    <div className="register-logo-area">
                        <img src={logo} alt="BookStore Logo" />
                    </div>

                    <h2 className="register-card-title">Tạo tài khoản mới</h2>
                    <p className="register-card-subtitle">
                        Tham gia cộng đồng đọc sách BookStore ngay hôm nay
                    </p>

                    {/* Username */}
                    <div className="register-field">
                        <label htmlFor="reg-username">Tên người dùng</label>
                        <div className="register-field-inner">
                            <FaUser className="register-field-icon" />
                            <input
                                id="reg-username"
                                type="text"
                                placeholder="Nhập tên người dùng..."
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="register-field">
                        <label htmlFor="reg-email">Email</label>
                        <div className="register-field-inner">
                            <FaEnvelope className="register-field-icon" />
                            <input
                                id="reg-email"
                                type="email"
                                placeholder="Nhập địa chỉ email..."
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="register-field">
                        <label htmlFor="reg-phone">Số điện thoại</label>
                        <div className="register-field-inner">
                            <FaPhone className="register-field-icon" />
                            <input
                                id="reg-phone"
                                type="tel"
                                placeholder="Nhập số điện thoại..."
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="register-field">
                        <label htmlFor="reg-password">Mật khẩu</label>
                        <div className="register-field-inner">
                            <FaLock className="register-field-icon" />
                            <input
                                id="reg-password"
                                type="password"
                                placeholder="Tạo mật khẩu..."
                            />
                        </div>
                        {/* Password strength bars */}
                        <div className="password-strength">
                            <div className="strength-bar" style={{ background: '#ef4444' }} />
                            <div className="strength-bar" />
                            <div className="strength-bar" />
                            <div className="strength-bar" />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="register-field">
                        <label htmlFor="reg-confirm-password">Xác nhận mật khẩu</label>
                        <div className="register-field-inner">
                            <FaLock className="register-field-icon" />
                            <input
                                id="reg-confirm-password"
                                type="password"
                                placeholder="Nhập lại mật khẩu..."
                            />
                        </div>
                    </div>

                    {/* Terms */}
                    <label className="register-terms">
                        <input type="checkbox" />
                        <span>
                            Tôi đồng ý với <a href="/">Điều khoản dịch vụ</a> và{" "}
                            <a href="/">Chính sách bảo mật</a> của BookStore
                        </span>
                    </label>

                    {/* Submit */}
                    <button type="submit" className="register-submit-btn">
                        <FaUserPlus />
                        Đăng ký
                    </button>

                    {/* Login link */}
                    <p className="register-login-link">
                        Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Register;