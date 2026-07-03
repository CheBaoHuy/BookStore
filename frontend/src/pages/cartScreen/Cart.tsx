import React, { useEffect } from "react";
import './Cart.css';
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { addToCart, removeFromCart, decreaseCart, clearCart, getTotals } from "../../redux/reducer/CartReducer";
import { Product } from "../../models";
import { FaCircleCheck, FaTrashCan } from "react-icons/fa6";
import centerImg4 from "../../images/center-4.jpg"; // Default fallback
import { getBookCover } from "../../common/imageHelper";

function Cart() {
    const dispatch = useDispatch();
    const { cartItems, cartTotalAmount } = useSelector((state: RootState) => state.carts);

    useEffect(() => {
        dispatch(getTotals());
    }, [cartItems, dispatch]);

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product));
    };

    const handleDecreaseCart = (product: Product) => {
        dispatch(decreaseCart(product));
    };

    const handleRemoveFromCart = (product: Product) => {
        dispatch(removeFromCart(product));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

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
                    {cartItems.length > 0 && (
                        <div className="cart-notification">
                            <FaCircleCheck className="cart-check-icon" />
                            <span>Cập nhật giỏ hàng thành công!</span>
                        </div>
                    )}

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
                        {cartItems.length === 0 ? (
                            <div className="text-center py-5">
                                <h4>Giỏ hàng của bạn đang trống!</h4>
                                <a href="/" className="btn btn-primary mt-3">Tiếp tục mua sắm</a>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div className="cart-item-row" key={item.id}>
                                    <img className="cart-item-img" src={getBookCover(item.image, item.id)} alt={item.title} />
                                    <div className="cart-item-name">
                                        <strong>{item.title}</strong>
                                        <div className="text-muted" style={{ fontSize: "12px" }}>{item.author}</div>
                                    </div>
                                    <div className="cart-item-price">{item.currentPrice.toLocaleString("vi-VN")} VND</div>
                                    <div>
                                        <div className="cart-qty-controls">
                                            <button className="cart-qty-btn" onClick={() => handleDecreaseCart(item)}>−</button>
                                            <input className="cart-qty-input" type="number" value={item.cartTotal || 1} min={1} readOnly />
                                            <button className="cart-qty-btn" onClick={() => handleAddToCart(item)}>+</button>
                                        </div>
                                    </div>
                                    <div className="cart-item-subtotal">
                                        {((item.cartTotal || 1) * item.currentPrice).toLocaleString("vi-VN")} VND
                                    </div>
                                    <button className="cart-delete-btn" onClick={() => handleRemoveFromCart(item)} aria-label="Xóa">
                                        <FaTrashCan />
                                    </button>
                                </div>
                            ))
                        )}

                        {/* Actions */}
                        {cartItems.length > 0 && (
                            <div className="cart-actions-bar">
                                <div className="coupon-form">
                                    <input
                                        type="text"
                                        className="coupon-input"
                                        placeholder="Mã giảm giá..."
                                    />
                                    <button className="coupon-btn">Áp dụng</button>
                                </div>
                                <button className="update-cart-btn btn-danger text-white bg-danger border-0" onClick={handleClearCart}>
                                    Xóa sạch giỏ hàng
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="order-summary-card">
                    <h3 className="order-summary-title">Tổng tiền giỏ hàng</h3>

                    <div className="order-summary-row">
                        <span>Tổng cộng</span>
                        <span>{cartTotalAmount.toLocaleString("vi-VN")} VND</span>
                    </div>
                    <div className="order-summary-row">
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                    </div>
                    <div className="order-summary-row total">
                        <span>Thành tiền</span>
                        <span className="order-total-price">{cartTotalAmount.toLocaleString("vi-VN")} VND</span>
                    </div>


                    <a href="/" className="continue-shopping-btn text-center" style={{ textDecoration: "none" }}>
                        Tiếp tục mua sắm
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Cart;