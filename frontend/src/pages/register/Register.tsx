import React, { useState } from "react";
import "./Register.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import logo from "../../images/logo_green.png";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from "react-icons/fa";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !email || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Xác nhận mật khẩu không khớp.");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:8080/api/auth/register", {
                username,
                email,
                phone,
                password,
                fullName: username // use username as fallback for full name
            });

            setSuccess("Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err: any) {
            console.error("Register error:", err);
            const msg = err.response?.data?.message || "Đăng ký không thành công. Tên đăng nhập hoặc Email có thể đã tồn tại.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

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

                    {error && <div className="alert alert-danger text-center py-2 px-3 mb-3" style={{ fontSize: "14px", borderRadius: "6px" }}>{error}</div>}
                    {success && <div className="alert alert-success text-center py-2 px-3 mb-3" style={{ fontSize: "14px", borderRadius: "6px" }}>{success}</div>}

                    <form onSubmit={handleRegister}>
                        {/* Username */}
                        <div className="register-field">
                            <label htmlFor="reg-username">Tên người dùng <span className="text-danger">*</span></label>
                            <div className="register-field-inner">
                                <FaUser className="register-field-icon" />
                                <input
                                    id="reg-username"
                                    type="text"
                                    placeholder="Nhập tên người dùng..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="register-field">
                            <label htmlFor="reg-email">Email <span className="text-danger">*</span></label>
                            <div className="register-field-inner">
                                <FaEnvelope className="register-field-icon" />
                                <input
                                    id="reg-email"
                                    type="email"
                                    placeholder="Nhập địa chỉ email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="register-field">
                            <label htmlFor="reg-password">Mật khẩu <span className="text-danger">*</span></label>
                            <div className="register-field-inner">
                                <FaLock className="register-field-icon" />
                                <input
                                    id="reg-password"
                                    type="password"
                                    placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="register-field">
                            <label htmlFor="reg-confirm-password">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                            <div className="register-field-inner">
                                <FaLock className="register-field-icon" />
                                <input
                                    id="reg-confirm-password"
                                    type="password"
                                    placeholder="Nhập lại mật khẩu..."
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="register-submit-btn" disabled={loading}>
                            <FaUserPlus />
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </form>

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