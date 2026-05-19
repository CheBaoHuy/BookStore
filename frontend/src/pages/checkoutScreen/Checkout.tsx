import React from "react";
import "./Checkout.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { FaCircleCheck } from "react-icons/fa6";

function Checkout() {
    return (
        <div className="checkout-page">
            <Header />

            {/* HERO */}
            <div className="checkout-hero">
                <div className="container">
                    <h1>Thanh toán</h1>
                    <div className="checkout-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span>/</span>
                        <span>Thanh toán</span>
                    </div>
                </div>
            </div>

            {/* COUPON BANNER */}
            <div className="checkout-coupon-banner">
                <div className="checkout-coupon-toggle">
                    <FaCircleCheck className="coupon-icon" />
                    <span>Bạn có mã giảm giá? Nhập ngay tại đây!</span>
                </div>
                <div className="coupon-inline-form">
                    <input
                        type="text"
                        className="coupon-inline-input"
                        placeholder="Nhập mã giảm giá..."
                    />
                    <button className="coupon-apply-btn">Áp dụng</button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="checkout-main">

                {/* LEFT COLUMN */}
                <div>
                    {/* DELIVERY INFO */}
                    <div className="checkout-card">
                        <h3 className="checkout-section-title">Thông tin giao hàng</h3>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Họ <span className="required">*</span></label>
                                <input type="text" placeholder="Nhập họ..." />
                            </div>
                            <div className="form-field">
                                <label>Tên <span className="required">*</span></label>
                                <input type="text" placeholder="Nhập tên..." />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Email <span className="required">*</span></label>
                                <input type="email" placeholder="Nhập địa chỉ email..." />
                            </div>
                            <div className="form-field">
                                <label>Số điện thoại <span className="required">*</span></label>
                                <input type="tel" placeholder="Nhập số điện thoại..." />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Quốc gia <span className="required">*</span></label>
                            <input type="text" placeholder="Nhập quốc gia..." />
                        </div>

                        <div className="form-field">
                            <label>Địa chỉ <span className="required">*</span></label>
                            <input type="text" placeholder="Số nhà, tên đường..." />
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Mã ZIP <span className="required">*</span></label>
                                <input type="text" placeholder="Nhập mã ZIP..." />
                            </div>
                            <div className="form-field">
                                <label>Tỉnh/Thành phố <span className="required">*</span></label>
                                <input type="text" placeholder="Chọn tỉnh/thành..." />
                            </div>
                        </div>
                    </div>

                    {/* ORDER NOTES */}
                    <div className="checkout-card">
                        <h3 className="checkout-section-title">Ghi chú đơn hàng</h3>
                        <div className="form-field">
                            <label>Ghi chú</label>
                            <textarea placeholder="Vui lòng điền thêm ghi chú về đơn hàng của bạn..." />
                        </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="checkout-card">
                        <h3 className="checkout-section-title">Phương thức thanh toán</h3>
                        <div className="payment-methods">
                            <label className="payment-method">
                                <input type="radio" name="payment" defaultChecked />
                                <span className="payment-method-label">🏦 Thanh toán qua ngân hàng</span>
                            </label>
                            <label className="payment-method">
                                <input type="radio" name="payment" />
                                <span className="payment-method-label">💵 Thanh toán khi nhận hàng (COD)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <div className="order-sidebar">
                    <div className="order-sidebar-card">
                        <h3 className="order-sidebar-title">Đơn hàng của bạn</h3>

                        <div className="order-table-header">
                            <span>Sản phẩm</span>
                            <span>Giá tiền</span>
                        </div>

                        <div className="order-table-row">
                            <div>
                                <div>The Book Of Love</div>
                                <div className="item-qty">x 1</div>
                            </div>
                            <span>300.000 VND</span>
                        </div>

                        <div className="order-total-line">
                            <span>Thành tiền</span>
                            <span className="order-total-amount">300.000 VND</span>
                        </div>

                        <button className="place-order-btn">
                            Đặt hàng ngay
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Checkout;