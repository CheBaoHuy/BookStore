import React from "react";
import "./Forgot.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { FaArrowLeft, FaKey, FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";

function Forgot() {
    return (
        <>
            <Header />
            <div className="forgot-page">
                <div className="forgot-card">

                    {/* Icon Area */}
                    <div className="forgot-icon-area">
                        <div className="forgot-icon-circle">
                            <FaKey />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="forgot-card-title">Quên mật khẩu?</h2>
                    <p className="forgot-card-subtitle">
                        Nhập thông tin tài khoản để xác minh và đặt lại mật khẩu của bạn
                    </p>

                    {/* Step Indicator */}
                    <div className="forgot-steps">
                        <div className="forgot-step active">
                            <div className="forgot-step-circle">1</div>
                            <span className="forgot-step-label">Xác minh</span>
                        </div>
                        <div className="forgot-step-line" />
                        <div className="forgot-step">
                            <div className="forgot-step-circle">2</div>
                            <span className="forgot-step-label">Đặt lại</span>
                        </div>
                        <div className="forgot-step-line" />
                        <div className="forgot-step">
                            <div className="forgot-step-circle">3</div>
                            <span className="forgot-step-label">Hoàn tất</span>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="forgot-info-box">
                        <MdInfoOutline />
                        <span>
                            Vui lòng điền đầy đủ thông tin bên dưới. Mã xác nhận sẽ được gửi về email của bạn.
                        </span>
                    </div>

                    {/* Username */}
                    <div className="forgot-field">
                        <label htmlFor="forgot-username">Tên người dùng</label>
                        <div className="forgot-field-inner">
                            <FaUser className="forgot-field-icon" />
                            <input
                                id="forgot-username"
                                type="text"
                                placeholder="Nhập tên đăng nhập..."
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="forgot-field">
                        <label htmlFor="forgot-email">Email</label>
                        <div className="forgot-field-inner">
                            <FaEnvelope className="forgot-field-icon" />
                            <input
                                id="forgot-email"
                                type="email"
                                placeholder="Nhập địa chỉ email..."
                            />
                        </div>
                    </div>

                    {/* Verification code */}
                    <div className="forgot-field">
                        <label htmlFor="forgot-code">Mã xác nhận</label>
                        <div className="forgot-field-inner">
                            <FaShieldAlt className="forgot-field-icon" />
                            <input
                                id="forgot-code"
                                type="text"
                                placeholder="Nhập mã xác nhận từ email..."
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="forgot-submit-btn">
                        Xác nhận
                    </button>

                    {/* Back to login */}
                    <p className="forgot-back-link">
                        <a href="/login">
                            <FaArrowLeft />
                            Quay lại đăng nhập
                        </a>
                    </p>

                </div>
            </div>
            <Footer />
        </>
    );
}

export default Forgot;