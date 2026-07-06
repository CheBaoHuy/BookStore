import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Forgot.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { FaArrowLeft, FaCheckCircle, FaEnvelope, FaKey, FaLock, FaShieldAlt } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";

function Forgot() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const stepMessage = useMemo(() => {
        if (step === 1) return "Nhập email tài khoản để nhận mã OTP đặt lại mật khẩu.";
        if (step === 2) return "Kiểm tra Gmail của bạn và nhập mã OTP 6 số để xác minh.";
        return "Nhập mật khẩu mới để hoàn tất việc đặt lại mật khẩu.";
    }, [step]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Vui lòng nhập email của bạn.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/auth/forgot-password", {
                email: email.trim()
            });
            setStep(2);
            setSuccess(response.data?.message || "Mã OTP đã được gửi đến email của bạn.");
        } catch (err) {
            setError(err.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp.trim()) {
            setError("Vui lòng nhập mã OTP.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/auth/forgot-password/verify-otp", {
                email: email.trim(),
                otp: otp.trim()
            });
            setStep(3);
            setSuccess(response.data?.message || "OTP đã được xác minh thành công.");
        } catch (err) {
            setError(err.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ mật khẩu mới.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Xác nhận mật khẩu không khớp.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/auth/forgot-password/reset", {
                email: email.trim(),
                otp: otp.trim(),
                newPassword,
                confirmPassword
            });
            setSuccess(response.data?.message || "Đặt lại mật khẩu thành công.");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể đặt lại mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    const renderCurrentForm = () => {
        if (step === 1) {
            return (
                <form onSubmit={handleSendOtp}>
                    <div className="forgot-field">
                        <label htmlFor="forgot-email">Email</label>
                        <div className="forgot-field-inner">
                            <FaEnvelope className="forgot-field-icon" />
                            <input
                                id="forgot-email"
                                type="email"
                                placeholder="Nhập địa chỉ email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="forgot-submit-btn" disabled={loading}>
                        {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
                    </button>
                </form>
            );
        }

        if (step === 2) {
            return (
                <form onSubmit={handleVerifyOtp}>
                    <div className="forgot-field">
                        <label htmlFor="verify-email">Email đã xác minh</label>
                        <div className="forgot-field-inner">
                            <FaEnvelope className="forgot-field-icon" />
                            <input
                                id="verify-email"
                                type="email"
                                value={email}
                                readOnly
                                className="forgot-readonly-input"
                            />
                        </div>
                    </div>

                    <div className="forgot-field">
                        <label htmlFor="forgot-code">Mã OTP</label>
                        <div className="forgot-field-inner">
                            <FaShieldAlt className="forgot-field-icon" />
                            <input
                                id="forgot-code"
                                type="text"
                                placeholder="Nhập mã OTP 6 số..."
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            />
                        </div>
                    </div>

                    <button type="submit" className="forgot-submit-btn" disabled={loading}>
                        {loading ? "Đang xác minh..." : "Xác minh OTP"}
                    </button>

                    <button
                        type="button"
                        className="forgot-secondary-btn"
                        onClick={handleSendOtp}
                        disabled={loading}
                    >
                        Gửi lại OTP
                    </button>
                </form>
            );
        }

        return (
            <form onSubmit={handleResetPassword}>
                <div className="forgot-field">
                    <label htmlFor="new-password">Mật khẩu mới</label>
                    <div className="forgot-field-inner">
                        <FaLock className="forgot-field-icon" />
                        <input
                            id="new-password"
                            type="password"
                            placeholder="Nhập mật khẩu mới..."
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="forgot-field">
                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <div className="forgot-field-inner">
                        <FaLock className="forgot-field-icon" />
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Nhập lại mật khẩu mới..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="forgot-submit-btn" disabled={loading}>
                    {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
            </form>
        );
    };

    return (
        <>
            <Header />
            <div className="forgot-page">
                <div className="forgot-card">
                    <div className="forgot-icon-area">
                        <div className="forgot-icon-circle">
                            {step < 3 ? <FaKey /> : <FaCheckCircle />}
                        </div>
                    </div>

                    <h2 className="forgot-card-title">Quên mật khẩu?</h2>
                    <p className="forgot-card-subtitle">
                        {stepMessage}
                    </p>

                    <div className="forgot-steps">
                        <div className={`forgot-step ${step >= 1 ? "active" : ""}`}>
                            <div className="forgot-step-circle">1</div>
                            <span className="forgot-step-label">Nhận OTP</span>
                        </div>
                        <div className={`forgot-step-line ${step >= 2 ? "active" : ""}`} />
                        <div className={`forgot-step ${step >= 2 ? "active" : ""}`}>
                            <div className="forgot-step-circle">2</div>
                            <span className="forgot-step-label">Xác minh</span>
                        </div>
                        <div className={`forgot-step-line ${step >= 3 ? "active" : ""}`} />
                        <div className={`forgot-step ${step >= 3 ? "active" : ""}`}>
                            <div className="forgot-step-circle">3</div>
                            <span className="forgot-step-label">Đặt lại</span>
                        </div>
                    </div>

                    <div className="forgot-info-box">
                        <MdInfoOutline />
                        <span>
                            Hệ thống sẽ gửi mã OTP đến Gmail của bạn. Mã có hiệu lực trong 10 phút.
                        </span>
                    </div>

                    {error && <div className="forgot-alert forgot-alert-error">{error}</div>}
                    {success && <div className="forgot-alert forgot-alert-success">{success}</div>}

                    {renderCurrentForm()}

                    <p className="forgot-back-link">
                        <Link to="/login">
                            <FaArrowLeft />
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Forgot;
