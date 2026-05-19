import React from "react";
import "./Login.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import logo from "../../images/logo_green.png";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

function Login() {
    return (
        <>
            <Header />
            <div className="login-page">
                <div className="login-card">

                    {/* Logo */}
                    <div className="login-logo-area">
                        <img src={logo} alt="BookStore Logo" />
                    </div>

                    <h2 className="login-card-title">Chào mừng trở lại!</h2>
                    <p className="login-card-subtitle">Đăng nhập để tiếp tục mua sắm sách</p>

                    {/* Username */}
                    <div className="login-field">
                        <label htmlFor="login-username">Tên đăng nhập hoặc Email</label>
                        <div className="login-field-inner">
                            <FaUser className="login-field-icon" />
                            <input
                                id="login-username"
                                type="text"
                                placeholder="Nhập tên đăng nhập..."
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="login-field">
                        <label htmlFor="login-password">Mật khẩu</label>
                        <div className="login-field-inner">
                            <FaLock className="login-field-icon" />
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Nhập mật khẩu..."
                            />
                        </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="login-extras">
                        <label className="login-remember">
                            <input type="checkbox" />
                            Nhớ mật khẩu
                        </label>
                        <a href="/forgot" className="login-forgot">Quên mật khẩu?</a>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="login-submit-btn">
                        <FaSignInAlt />
                        Đăng nhập
                    </button>

                    {/* Divider */}
                    <div className="login-divider">hoặc</div>

                    {/* Register link */}
                    <p className="login-register-link">
                        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Login;