import React from "react";
import './Cart.css'
import ProductCart from "../../images/Product Images/"
import { FaCircleCheck } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";

function Cart() {
    return (
        <div className="Cart_container">
            <div className={"cart_label"}>
                <div className={"cart_title"}>
                    <h2 className={"title"}>Giỏ hàng</h2>
                </div>
                <div className={"cart_page"}>
                    <a><h6 className={"cart_home"}>Trang chủ /</h6></a>
                    <h5 className={"cart_name"}>Giỏ hàng</h5>
                </div>
            </div>
            <div className={"noti"}>
                <FaCircleCheck className={"check-icon"}/>
                <p>Cập nhật giỏ hàng thành công!</p>
            </div>
            <div className={"table_product"}>
                <form>
                    <div className={"table_products"}>
                        <div>
                            <div className={"table_head"}>
                                <p className="product-thumbnail">&nbsp;</p>
                                <p className="product-name">Tên sản phẩm</p>
                                <p className="product-price">Giá tiền</p>
                                <p className="product-quantity">Số lượng</p>
                                <p className="product-subtotal">Tổng cộng</p>
                            </div>
                        </div>
                        <div className={"body_table"}>
                            <div className="cart_item">
                                <div className="product-thumbnail">
                                    <img className={"image"} src={ProductCart}/>
                                </div>
                                <div className="product-name">
                                    <a href="">The Book Of Love </a>
                                </div>
                                <div className="product-price">
                                <span className="amount"><span
                                    className="currencySymbol">VND</span>300.000</span></div>
                                <div className="product-quantity">
                                    <div className="quantity">
                                        <input className={"quantity_input"} type={"number"} step={1} min={1} size={4}
                                               placeholder={"1"}/>
                                    </div>
                                    <div className={"delete"}>
                                        <FaTrashCan className={"trashcan"}/>
                                    </div>
                                </div>
                                <div className="product-subtotal">
                                <span className="amount"><span
                                    className="currencySymbol">VND</span>300.000</span></div>

                            </div>
                            <div>
                                <div className="actions">
                                    <div className="coupon">
                                        <input type="text" name="coupon_code"
                                               className="input-text"
                                               id="coupon_code" value=""
                                               placeholder="Mã giảm giá"/>
                                        <input type="submit" className="button" name="apply_coupon"
                                               value="Nhập mã giảm giá"/>
                                    </div>
                                    <div className={"update_button"}>
                                        <input type="submit" className="button" name="update_cart" value="Cập nhật"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className={"total_table"}>
                <h2 className={"total_title"}>Tổng tiền giỏ hàng</h2>
                <div className={"cart_total"}>
                    <div className="shop_table shop_table_responsive">
                        <div className="total">
                            <p>Tổng cộng</p>
                            <div className={"total_price"} data-title="Subtotal"><span className="amount"><span
                                className="currencySymbol">VND</span>300.000</span></div>
                        </div>
                        <div className="order-total">
                            <p>Thành tiền</p>
                            <div className={"total_price"} data-title="Total"><strong><span className="amount">
                                <span className="currencySymbol">VND</span>300.000</span></strong></div>
                        </div>
                    </div>
                </div>
                <div className="checkout">
                    <div>
                        <a href="https://wp.acmeedesign.com/bookstore/checkout/"
                           className="checkout-button button alt wc-forward">Thanh toán</a>
                    </div>
                    <div>
                        <a href="https://wp.acmeedesign.com/bookstore/shop/"
                           className="button button-secondary continue_shoping">Tiếp tục mua sắm</a>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Cart;