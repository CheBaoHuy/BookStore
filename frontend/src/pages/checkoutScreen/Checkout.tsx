import React from "react";
import "./Checkout.css";
import ProductCart from "../../images/Product Images/book17.png";
import {FaCircleCheck} from "react-icons/fa6";

function Checkout() {
    return (
        <div className={"checkout_container"}>
            <div className={"checkout_label"}>
                <div className={"checkout_title"}>
                    <h2 className={"title"}>Thanh toán</h2>
                </div>
                <div className={"checkout_page"}>
                    <a><h6 className={"checkout_home"}>Trang chủ /</h6></a>
                    <h5 className={"checkout_name"}>Thanh toán</h5>
                </div>
            </div>
            <div className={"coupon_noti"}>
                <FaCircleCheck className={"check-icon"}/>
                <p>Bạn có mã giảm giá? Nhập ngay tại đây!</p>
            </div>
            <div className="coupon">
                <input type="text" name="coupon_code"
                       className="input-text"
                       id="coupon_code" value=""
                       placeholder="Mã giảm giá"/>
                <input type="submit" className="button" name="apply_coupon"
                       value="Nhập mã giảm giá"/>
            </div>
            <div className={"delivery_info"}>
                <div className={"main_info"}>
                    <h3>Thông tin giao hàng</h3>
                    <div className={"half_section"}>
                        <div className={"half_input"}>
                            <label>Họ<span className={"notice"}>*</span></label>
                            <input type={"text"} className={"info_name"}/>
                        </div>
                        <div className={"half_input"}>
                            <label>Tên<span className={"notice"}>*</span></label>
                            <input type={"text"} className={"info_name"}/>
                        </div>
                    </div>
                    <div className={"half_section"}>
                        <div className={"half_input"}>
                            <label>Email<span className={"notice"}>*</span></label>
                            <input type={"text"} className={"info_name"}/>
                        </div>
                        <div className={"half_input"}>
                            <label>Số điện thoại<span className={"notice"}>*</span></label>
                            <input type={"text"} className={"info_name"}/>
                        </div>
                    </div>
                    <div className={"full-type"}>
                        <label>Quốc gia<span className={"notice"}>*</span></label>
                        <input type={"text"} className={"full_input"}/>
                    </div>
                    <div className={"full-type"}>
                        <label>Địa chỉ<span className={"notice"}>*</span></label>
                        <input type={"text"} className={"full_input"}/>
                    </div>
                    <div className={"half_section"}>
                        <div className={"half_input"}>
                            <label>Mã ZIP<span className={"notice"}>*</span></label>
                            <input type={"text"} className={"info_name"}/>
                        </div>
                        <div className={"half_input"}>
                            <label>Tỉnh/Thành phố<span className={"notice"}>*</span></label>
                            <input type={"text"} className={"info_name"}/>
                        </div>
                    </div>
                </div>
                <div className={"note_info"}>
                    <h3>Thông tin ghi thích thêm</h3>
                    <label>Ghi chú đơn hàng</label>
                    <input type={"text"} className={"note_input"} placeholder={"Vui lòng điền thêm ghi chú về đơn hàng của bạn!"}/>
                </div>
            </div>
            <div className={"order_info"}>
                <h3>Đơn hàng của bạn</h3>
                <div className={"table_order"}>
                    <div className={"table_title"}>
                        <h4>Tên sản phẩm</h4>
                        <h4>Giá tiền</h4>
                    </div>
                    <div className={"table_product"}>
                        <div className={"products"}>
                            <div className={"product"}>
                                <p className={"book_name"}>The Book Of Love</p>
                                <p className={"quantity_text"}>x 1</p>
                            </div>
                            <div className={"product_price"}>
                                <p className={"price"}>300.000</p>
                                <p className={"currency"}>VND</p>
                            </div>
                        </div>
                    </div>
                    <div className={"total"}>
                        <div className={"title_sum"}>
                            <h4>Tổng cộng</h4>
                        </div>
                        <div className={"price_total"}>
                            <p className={"price"}>300.000</p>
                            <p className={"currency"}>VND</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"payment"}>
                <div className={"option"}>
                    <div className={"method"}>
                        <input type={"radio"}/>
                        <p>Thanh toán qua ngân hàng</p>
                    </div>
                    <div className={"method"}>
                        <input type={"radio"}/>
                        <p>Thanh toán khi nhận hàng</p>
                    </div>
                </div>
                <div className={"place_order"}>
                    <input type={"submit"} className={"order_button"} value={"Đặt hàng"}/>
                </div>
            </div>
        </div>
    );
}

export default Checkout;