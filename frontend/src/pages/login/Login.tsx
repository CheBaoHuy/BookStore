import React, { useState } from "react";
import "./Login.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import logo from "../../images/logo_green.png";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !password) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("token", response.data.token);
                setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            } else {
                setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            const msg = err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

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

                    {error && <div className="alert alert-danger text-center py-2 px-3 mb-3" style={{ fontSize: "14px", borderRadius: "6px" }}>{error}</div>}
                    {success && <div className="alert alert-success text-center py-2 px-3 mb-3" style={{ fontSize: "14px", borderRadius: "6px" }}>{success}</div>}

                    <form onSubmit={handleLogin}>
                        {/* Username */}
                        <div className="login-field">
                            <label htmlFor="login-username">Tên đăng nhập hoặc Email</label>
                            <div className="login-field-inner">
                                <FaUser className="login-field-icon" />
                                <input
                                    id="login-username"
                                    type="text"
                                    placeholder="Nhập tên đăng nhập..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            <FaSignInAlt />
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>

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