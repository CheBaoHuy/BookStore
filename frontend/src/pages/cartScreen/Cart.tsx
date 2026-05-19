import React from "react";
import './Cart.css';
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import ProductCart from "../../images/ProductImages/book17.png";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";

function Cart() {
    return (
        <div className="cart-page">
            <Header />

            {/* HERO */}
            <div className="cart-hero">
                <div className="container">
                    <h1>Giỏ hàng</h1>
                    <div className="cart-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span>/</span>
                        <span>Giỏ hàng</span>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="cart-content">
                {/* LEFT: ITEMS */}
                <div>
                    <div className="cart-notification">
                        <FaCircleCheck className="cart-check-icon" />
                        <span>Cập nhật giỏ hàng thành công!</span>
                    </div>

                    <div className="cart-table-card">
                        {/* Header */}
                        <div className="cart-table-header">
                            <span></span>
                            <span>Tên sản phẩm</span>
                            <span>Giá tiền</span>
                            <span>Số lượng</span>
                            <span>Tổng cộng</span>
                            <span></span>
                        </div>

                        {/* Items */}
                        <div className="cart-item-row">
                            <img className="cart-item-img" src={ProductCart} alt="The Book Of Love" />
                            <div className="cart-item-name">The Book Of Love</div>
                            <div className="cart-item-price">300.000 VND</div>
                            <div>
                                <div className="cart-qty-controls">
                                    <button className="cart-qty-btn">−</button>
                                    <input className="cart-qty-input" type="number" value={1} min={1} readOnly />
                                    <button className="cart-qty-btn">+</button>
                                </div>
                            </div>
                            <div className="cart-item-subtotal">300.000 VND</div>
                            <button className="cart-delete-btn" aria-label="Xóa">
                                <FaTrashCan />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="cart-actions-bar">
                            <div className="coupon-form">
                                <input
                                    type="text"
                                    className="coupon-input"
                                    placeholder="Mã giảm giá..."
                                />
                                <button className="coupon-btn">Áp dụng</button>
                            </div>
                            <button className="update-cart-btn">Cập nhật giỏ hàng</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="order-summary-card">
                    <h3 className="order-summary-title">Tổng tiền giỏ hàng</h3>

                    <div className="order-summary-row">
                        <span>Tổng cộng</span>
                        <span>300.000 VND</span>
                    </div>
                    <div className="order-summary-row">
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                    </div>
                    <div className="order-summary-row total">
                        <span>Thành tiền</span>
                        <span className="order-total-price">300.000 VND</span>
                    </div>

                    <a href="/checkout" className="checkout-btn">
                        Tiến hành thanh toán
                    </a>
                    <a href="/" className="continue-shopping-btn">
                        Tiếp tục mua sắm
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Cart;