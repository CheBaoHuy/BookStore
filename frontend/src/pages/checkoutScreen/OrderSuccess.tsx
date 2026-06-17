import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import "./OrderSuccess.css";

function OrderSuccess() {
    const [params] = useSearchParams();
    const orderId = params.get("orderId");
    const total = params.get("total");

    return (
        <div className="order-success-page">
            <Header />
            <div className="order-success-container">
                <div className="success-card">
                    {/* Animated checkmark */}
                    <div className="success-checkmark">
                        <div className="check-circle">
                            <svg className="check-svg" viewBox="0 0 52 52">
                                <circle className="check-circle-bg" cx="26" cy="26" r="25" fill="none" />
                                <path className="check-path" fill="none" d="M14 27 l8 8 l16-16" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="success-title">Đặt hàng thành công! 🎉</h1>
                    <p className="success-subtitle">
                        Cảm ơn bạn đã tin tưởng BookStore. Đơn hàng của bạn đang được xử lý.
                    </p>

                    <div className="success-order-info">
                        <div className="success-info-row">
                            <span>Mã đơn hàng</span>
                            <strong>#{orderId}</strong>
                        </div>
                        {total && (
                            <div className="success-info-row">
                                <span>Tổng thanh toán</span>
                                <strong className="success-total">{Number(total).toLocaleString("vi-VN")}₫</strong>
                            </div>
                        )}
                        <div className="success-info-row">
                            <span>Trạng thái</span>
                            <span className="success-status-badge">Chờ xác nhận</span>
                        </div>
                        <div className="success-info-row">
                            <span>Thời gian giao hàng dự kiến</span>
                            <strong>2–4 ngày làm việc</strong>
                        </div>
                    </div>

                    {/* Progress steps */}
                    <div className="success-steps">
                        <div className="step active">
                            <div className="step-dot">✓</div>
                            <span>Đặt hàng</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step pending">
                            <div className="step-dot">2</div>
                            <span>Xác nhận</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step pending">
                            <div className="step-dot">3</div>
                            <span>Đang giao</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step pending">
                            <div className="step-dot">4</div>
                            <span>Hoàn thành</span>
                        </div>
                    </div>

                    <div className="success-actions">
                        <Link to="/orders" className="btn-track-order">
                            📦 Theo dõi đơn hàng
                        </Link>
                        <Link to="/" className="btn-continue-shop">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default OrderSuccess;
